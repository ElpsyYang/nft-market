// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./NftMarket.sol";

contract NftMarket2 is NftMarket {

  event NftItemCreated (
    uint tokenId,
    uint price,
    address creator,
    bool isListed
  );

  constructor() {
  }

  // 向检测机构名单中添加检测机构地址
  function setTestOrg(address orgAdd) public onlyOwner returns(bool){
    require(super.testOrgList[orgAdd] != true, "orgAdd already included in the testOrg list");
    super.testOrgList[orgAdd] = true;
    return true;
  }

  // 检查指定地址是否是位于检测机构名单中
  function containTestOrg(address orgAdd) public view returns(bool){
    return super.testOrgList[orgAdd];
  }

  // 机构检车出基因数据后向链上提交有关信息并等待用户验证
  // address testOrg;        检测机构
  // string data;            对称加密后的数据地址
  // string dataHash;        加密数据地址的hash
  // string orgSign;         检测机构对hash的签名
  // uint firstProportion;   初次分成比例
  // bool sustainProportion; 是否持续给检测机构分成
  function setNftOrgInfo(
    address testOrg,
    string memory data,
    bytes32 dataHash,
    bytes memory orgSign,
    uint firstProportion,
    bool sustainProportion
    ) public returns(bool){
    require(containTestOrg(msg.sender) == true, "invalid test orgnization");
    require(_recoverSigner(dataHash, orgSign) == testOrg, "invald signature");
    require( firstProportion >= 0 && firstProportion <= 100 , "firstProportion is out of range");

    _HashToNftItem[dataHash] = super.NftItem(
      NftState.Signed,
      0,
      0,
      0,
      address(0),
      false,
      0,
      msg.sender,
      data,
      dataHash,
      orgSign,
      firstProportion,
      sustainProportion,
      "",
      0,
      "",
      address(0),
      ""
    );
    return true;  
  }

  // tokenURI metadata
  // price 当前token价格
  // dataHash 数据原文hash
  // sign 基因提供者对包含个人信息的metadata的签名
  // proportion 后续分成比例
  // encrypedKey 加密后秘钥
  function mintToken(
    string memory tokenURI,
    uint price,
    bytes32 dataHash,
    bytes memory sign,   
    uint proportion,
    string memory encryptedKey
    ) public payable returns (uint) {
    require(!tokenURIExists(tokenURI), "Token URI already exists");
    require(msg.value == listingPrice, "Price must be equal to listing price");
    require(_recoverSignerByMessage(tokenURI, sign) == msg.sender, "invald signature");

    super._tokenIds.increment();
    super._listedItems.increment();

    uint newTokenId = super._tokenIds.current();

    _beforeTokenTransfer(address(0), msg.sender, newTokenId);
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _createNftItem(newTokenId, price, dataHash, sign, proportion, encryptedKey);
    super._usedTokenURIs[tokenURI] = true;

    return newTokenId;
  }

  // 消费者购买时调用 提交消费者地址、签名，转账到平台，并修改nft状态
  function buyNft( uint tokenId, bytes memory consumerSign) public payable returns(bool){
    require(msg.sender != ERC721.ownerOf(tokenId), "You already own this NFT");
    require(msg.value == super._idToNftItem[tokenId].price, "Please submit the asking price");
    require(super._idToNftItem[tokenId].state == NftState.Minted, "Nft state is not Minted");

    super._idToNftItem[tokenId].state = NftState.Offering;
    super._HashToNftItem[super._idToNftItem[tokenId].dataHash].state = NftState.Offering;
    super._idToNftItem[tokenId].isListed = false;
    super._HashToNftItem[super._idToNftItem[tokenId].dataHash].isListed = false;
    super._idToNftItem[tokenId].consumer = msg.sender;
    super._HashToNftItem[super._idToNftItem[tokenId].dataHash].consumer = msg.sender;
    super._idToNftItem[tokenId].consumerSign = consumerSign;
    super._HashToNftItem[super._idToNftItem[tokenId].dataHash].consumerSign = consumerSign;
    super._listedItems.decrement();

    return true;
  }

  // 用户提交用consumer公钥加密后的对称秘钥，并确认交易
  function confirmTx(uint tokenId, string memory encryptedKey)public {
    require(super._idToNftItem[tokenId].state == NftState.Offering, "Nft state is not offering");

    address owner = ERC721.ownerOf(tokenId);
    require(owner == msg.sender, "Nft is not belong to you");
    super._idToNftItem[tokenId].encryptedKey = encryptedKey;
    super._HashToNftItem[super._idToNftItem[tokenId].dataHash].encryptedKey = encryptedKey;

    address consumer = super._idToNftItem[tokenId].consumer;
    _beforeTokenTransfer(owner, consumer, tokenId);
    _transfer(owner, consumer, tokenId);
    _dividend(tokenId, owner);
    super._idToNftItem[tokenId].state = NftState.Minted;
    super._HashToNftItem[super._idToNftItem[tokenId].dataHash].state = NftState.Minted;
  }

  // tokenId tokenID
  // price 当前token价格
  // dataHash 数据原文hash
  // sign 基因提供者对包含个人信息的metadata的签名
  // proportion 后续分成比例
  // encrypedKey 加密后秘钥
  function _createNftItem(
    uint tokenId,
    uint price,
    bytes32 dataHash,
    bytes memory sign,   
    uint proportion,
    string memory encryptedKey
  ) private {
    require(price > 0, "Price must be at least 1 wei");
    require( proportion >= 0 && proportion <= 100 , "proportion is out of range");

    NftItem memory item = _getNftItemByHash(dataHash);

    item.state = NftState.Minted;
    item.tokenId = tokenId;
    item.price = price;
    item.maxPrice = price;
    item.creator = msg.sender;
    item.isListed = true;
    item.sign = sign;
    item.proportion = proportion;
    item.encryptedKey = encryptedKey;

    super._idToNftItem[tokenId] = item;
    super._HashToNftItem[dataHash] = item;

    emit NftItemCreated(tokenId, price, msg.sender, true);
  }

  function _dividend(uint tokenId, address owner) internal {
    address creator = super._idToNftItem[tokenId].creator; 
    uint price = super._idToNftItem[tokenId].price;
    uint maxPrice = super._idToNftItem[tokenId].maxPrice;
    uint txCount = super._idToNftItem[tokenId].txCount;
    address testOrg = super._idToNftItem[tokenId].testOrg;
    bytes32 dataHash = super._idToNftItem[tokenId].dataHash;
    uint firstProportion = super._idToNftItem[tokenId].firstProportion;
    bool sustainProportion = super._idToNftItem[tokenId].sustainProportion;
    uint proportion = super._idToNftItem[tokenId].proportion;

    // 首次交易时，只需要给机构和基因提供者分成
    if ( txCount == 0 ){
      if ( firstProportion == 0 ){
        payable(creator).transfer(price);
      }else if ( firstProportion == 100 ){
        payable(testOrg).transfer(price);
      }else {
        payable(testOrg).transfer(price * firstProportion / 100);
        payable(creator).transfer(price * ( 100 - firstProportion )/ 100);
      }
    }

    // 非首次交易且价格高于历史最高价格时，需要结合参数给基因提供者、检测机构分成
    if ( price > maxPrice && txCount != 0){
      if( sustainProportion == false ){ //不给机构持续分红
        if ( proportion == 0 ){  //个人不参与分红
          payable(owner).transfer(price);
        }else if ( proportion == 100 ){ //增值完全归属个人
          payable(creator).transfer( price - maxPrice );
          payable(owner).transfer( maxPrice );
        }else{  //增值按比例分配给个人
          payable(creator).transfer( (price - maxPrice) * proportion / 100 );
          payable(owner).transfer( price - (price - maxPrice) * proportion / 100 );
        }
      }else{   //给机构持续分红
        if ( proportion == 100 ) {    //增值全部分给个人
          payable(creator).transfer( price - maxPrice );
          payable(owner).transfer( maxPrice );
        }else if ( proportion == 0 ){  //增值全部分给机构
          payable(testOrg).transfer( price - maxPrice );
          payable(owner).transfer( maxPrice );
        }else{  //增值按比例分给个人，剩余增值部分按比例分给机构，最后剩余价值分给拥有者
          payable(creator).transfer( (price - maxPrice) * proportion / 100 );
          payable(testOrg).transfer( ((price - maxPrice) * (100 - proportion )/ 100 )* firstProportion / 100);
          payable(owner).transfer( price - (price - maxPrice) * proportion / 100 
          - ((price - maxPrice) * (100 - proportion )/ 100 )* firstProportion / 100 );
        }
      }

      //更新历史最高价格
      super._idToNftItem[tokenId].maxPrice = price;
      super._HashToNftItem[dataHash].maxPrice = price;
    }

    if (price <=  maxPrice && txCount != 0){ //非首次交易但价格低于历史最高价格全部转账给拥有者
      payable(owner).transfer( price );
    }

    //更新历史交易数
    super._idToNftItem[tokenId].txCount = txCount + 1;
    super._HashToNftItem[dataHash].txCount = txCount + 1;
  }

  // 从messageHash和签名中恢复签名地址用于验证签名有效性
  function _recoverSigner(bytes32 dataHash, bytes memory signature) internal pure returns (address) {
      //bytes32 hash = keccak256(abi.encodePacked(dataHash));
      //bytes32 message = ECDSA.toEthSignedMessageHash(hash);
      //return ECDSA.recover(message, signature);
      return ECDSA.recover(dataHash, signature);
  }

  // 从message和签名中恢复签名地址用于验证签名有效性
  function _recoverSignerByMessage(string memory message, bytes memory signature) internal pure returns (address) {
      bytes32 hash = keccak256(abi.encodePacked(message));
      bytes32 ethMessage = ECDSA.toEthSignedMessageHash(hash);
      return ECDSA.recover(ethMessage, signature);
  }

  // 根据hash获取nftItem信息，用于用户mint时读取测序机构写入的信息
  function _getNftItemByHash(bytes32 hash) public view returns (NftItem memory){
    return _HashToNftItem[hash];
  }
}
