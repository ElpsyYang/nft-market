// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract NftMarket is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;

  enum NftState {Signed, Minted, Offering}
  // enum NftState {Signed, Minted, Offering, Encrypted, Failed, Encrypting}

  struct NftItem {
      NftState state;          //NFT状态
  
      uint tokenId;            //tokenID
      uint price;              //当前token价格
      uint maxPrice;           //token历史最高价格
      address creator;         //token创造者即基因提供者
      bool isListed;           //是否出于出售状态
      uint txCount;            //交易次数
  
      address testOrg;         //检测机构
      string data;             //对称加密后的数据地址
      bytes32 dataHash;        //加密数据地址的hash
      bytes orgSign;           //检测机构对hash的签名
      uint firstProportion;    //初次分成比例,分给机构的百分比
      bool sustainProportion;  //是否持续给检测机构分成
  
      bytes sign;              //基因提供者对包含个人信息的metadata的签名
      uint proportion;         //后续分成比例，分给基因提供者的比例
      string encryptedKey;     //用创建者公钥加密后的对称加密秘钥
  
      address consumer;        //基因数据消费者地址
      bytes consumerSign;      //消费者对hash的签名
      string consumerKey;      //用消费者公钥加密后的对称加密秘钥
      string consumerPubKey;   //专门用于存储使用者公开公钥用于给使用者加密密钥
    }


  uint public listingPrice = 0.025 ether;
  // uint public providerProportion = 80;
  

  Counters.Counter private _listedItems;
  Counters.Counter private _tokenIds;

  mapping(address => bool) private testOrgList;
  mapping(bytes32 => NftItem) private _HashToNftItem;
  
  mapping(string => bool) private _usedTokenURIs;
  mapping(uint => NftItem) private _idToNftItem;

  mapping(address => mapping(uint => uint)) private _ownedTokens;
  mapping(uint => uint) private _idToOwnedIndex;

  uint256[] private _allNfts;
  mapping(uint => uint) private _idToNftIndex;

  event NftItemCreated (
    uint tokenId,
    uint price,
    address creator,
    bool isListed
  );

  constructor() ERC721("GenomesNFT", "GNFT") {}

  // 向检测机构名单中添加检测机构地址
  function setTestOrg(address orgAdd) public onlyOwner returns(bool){
    require(testOrgList[orgAdd] != true, "orgAdd already included in the testOrg list");
    testOrgList[orgAdd] = true;
    return true;
  }

  // 检查指定地址是否是位于检测机构名单中
  function containTestOrg(address orgAdd) public view returns(bool){
    return testOrgList[orgAdd];
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

    _HashToNftItem[dataHash] = NftItem(
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
      "",
      "",
      ""
    );
    return true;  
  }

  function setListingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    listingPrice = newPrice;
  }

  // function setProviderProportion(uint newPro) external onlyOwner {
  //   require(newPro >=30 && newPro <=80, "New Proportion must be between 30 and 80");
  //   providerProportion = newPro;
  // }

  function getNftItem(uint tokenId) public view returns (NftItem memory) {
    return _idToNftItem[tokenId];
  }

  function listedItemsCount() public view returns (uint) {
    return _listedItems.current();
  }

  function tokenURIExists(string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI] == true;
  }

  function totalSupply() public view returns (uint) {
    return _allNfts.length;
  }

  function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), "Index out of bounds");
    return _allNfts[index];
  }

  function tokenOfOwnerByIndex(address owner, uint index) public view returns (uint) {
    require(index < ERC721.balanceOf(owner), "Index out of bounds");
    return _ownedTokens[owner][index];
  }

  function getAllNftsOnSale() public view returns (NftItem[] memory) {
    uint allItemsCounts = totalSupply();
    uint currentIndex = 0;
    NftItem[] memory items = new NftItem[](_listedItems.current());

    for (uint i = 0; i < allItemsCounts; i++) {
      uint tokenId = tokenByIndex(i);
      NftItem storage item = _idToNftItem[tokenId];

      if (item.isListed == true) {
        items[currentIndex] = item;
        currentIndex += 1;
      }
    }

    return items;
  }

  function getOwnedNfts() public view returns (NftItem[] memory) {
    uint ownedItemsCount = ERC721.balanceOf(msg.sender);
    NftItem[] memory items = new NftItem[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
      uint tokenId = tokenOfOwnerByIndex(msg.sender, i);
      NftItem storage item = _idToNftItem[tokenId];
      items[i] = item;
    }

    return items;
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

    // if(_HashToNftItem[dataHash].sustainProportion == true){
    //   require(proportion <= (100 - _HashToNftItem[dataHash].firstProportion), "proportion should be less than the limit of provider proportion");
    // } 

    _tokenIds.increment();
    _listedItems.increment();

    uint newTokenId = _tokenIds.current();

    _beforeTokenTransfer(address(0), msg.sender, newTokenId);
    _safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _createNftItem(newTokenId, price, dataHash, sign, proportion, encryptedKey);
    _usedTokenURIs[tokenURI] = true;

    return newTokenId;
  }

  // 消费者购买时调用 提交消费者地址、签名，转账到平台，并修改nft状态
  function buyNft( uint tokenId, bytes memory consumerSign, string memory consumerPubKey) public payable returns(bool){
    require(msg.sender != ERC721.ownerOf(tokenId), "You already own this NFT");
    require(msg.value == _idToNftItem[tokenId].price, "Please submit the asking price");
    require(_idToNftItem[tokenId].state == NftState.Minted, "Nft state is not Minted");

    _idToNftItem[tokenId].isListed = false;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].isListed = false;
    
    _idToNftItem[tokenId].state = NftState.Offering;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].state = NftState.Offering;
    
    _idToNftItem[tokenId].consumer = msg.sender;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].consumer = msg.sender;
    _idToNftItem[tokenId].consumerSign = consumerSign;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].consumerSign = consumerSign;
    _idToNftItem[tokenId].consumerPubKey = consumerPubKey;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].consumerPubKey = consumerPubKey;
    _listedItems.decrement();

    return true;
  }

  // 用户提交用consumer公钥加密后的对称秘钥，并确认交易
  function confirmTx(uint tokenId, string memory consumerKey)public returns(bool){
    require(_idToNftItem[tokenId].state == NftState.Offering, "Nft state is not offering");

    address owner = ERC721.ownerOf(tokenId);
    require(owner == msg.sender, "Nft is not belong to you");
    _idToNftItem[tokenId].consumerKey = consumerKey;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].consumerKey = consumerKey;

    address consumer = _idToNftItem[tokenId].consumer;
    _beforeTokenTransfer(owner, consumer, tokenId);
    _transfer(owner, consumer, tokenId);
    _dividend(tokenId, owner);
    _idToNftItem[tokenId].state = NftState.Minted;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].state = NftState.Minted;

    return true;
  }
  
  // 所有者调用此函数更新可供消费者使用的秘钥
  // 所有者在看到有人购买的状态后，根据消费者的签名恢复出消费者的公钥并对原始秘钥加密后更新新的可供消费者私钥解密的对称秘钥
  // 如果状态为offering或者failed，用消费者公钥加密秘钥，如果状态为Encrypting，用自身公钥加密秘钥
  // function updateKey(uint tokenId, string memory encryptedKey) public {
  //   NftState state = _idToNftItem[tokenId].state;
  //   require(state == NftState.Offering || state == NftState.Failed ||  state == NftState.Encrypting, "Nft state is not offering or failed");
  //   require(ERC721.ownerOf(tokenId) == msg.sender, "Nft is not belong to you");

  //   _idToNftItem[tokenId].encryptedKey = encryptedKey;
  //   _HashToNftItem[_idToNftItem[tokenId].dataHash].encryptedKey = encryptedKey;

  //   if (state == NftState.Offering || state == NftState.Failed){
  //     _idToNftItem[tokenId].state = NftState.Encrypted;
  //     _HashToNftItem[_idToNftItem[tokenId].dataHash].state = NftState.Encrypted;
  //   }
  //   if (state == NftState.Encrypting){
  //     _idToNftItem[tokenId].state = NftState.Minted;
  //     _HashToNftItem[_idToNftItem[tokenId].dataHash].state = NftState.Minted;
  //   }
  // }

  // 消费者调用此函数发送验证结果，如果验证通过，则修改nft所有权并转账，如不通过，将nft状态改为failed提示用户更新或者退款
  // function verifyEncryptedKey( uint tokenId ) public {
  //   require(_idToNftItem[tokenId].state == NftState.Encrypted, "Nft state is not encrypted");
  //   require(_idToNftItem[tokenId].consumer == msg.sender, "you are not The consumer of this Nft");

  //   address owner = ERC721.ownerOf(tokenId);
  //   _beforeTokenTransfer(owner, msg.sender, tokenId);
  //   _transfer(owner, msg.sender, tokenId);
  //   _dividend(tokenId, owner);
  //   _idToNftItem[tokenId].state = NftState.Minted;
  //   _HashToNftItem[_idToNftItem[tokenId].dataHash].state = NftState.Minted;
    
  // }
  // // 在状态为failed状态时，消费者可发起退款，并修改状态提示用户提交用自身私钥加密的秘钥
  // function refund( uint tokenId) public {
  //   require(_idToNftItem[tokenId].state == NftState.Failed, "Nft state is not failed");
  //   require(_idToNftItem[tokenId].consumer == msg.sender, "you are not The consumer of this Nft");

  //   _idToNftItem[tokenId].state = NftState.Encrypting;
  //   _HashToNftItem[_idToNftItem[tokenId].dataHash].state = NftState.Encrypting;

  //   payable(msg.sender).transfer(_idToNftItem[tokenId].price);
  // }




  function placeNftOnSale(uint tokenId, uint newPrice) public payable {
    require(ERC721.ownerOf(tokenId) == msg.sender, "You are not owner of this nft");
    require(_idToNftItem[tokenId].isListed == false, "Item is already on sale");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _idToNftItem[tokenId].isListed = true;
    _idToNftItem[tokenId].price = newPrice;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].isListed = true;
    _HashToNftItem[_idToNftItem[tokenId].dataHash].price = newPrice;
    _listedItems.increment();
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

    _idToNftItem[tokenId] = item;
    _HashToNftItem[dataHash] = item;

    emit NftItemCreated(tokenId, price, msg.sender, true);
  }

  function _dividend(uint tokenId, address owner) internal {
    address creator = _idToNftItem[tokenId].creator; 
    uint price = _idToNftItem[tokenId].price;
    uint maxPrice = _idToNftItem[tokenId].maxPrice;
    uint txCount = _idToNftItem[tokenId].txCount;
    address testOrg = _idToNftItem[tokenId].testOrg;
    bytes32 dataHash = _idToNftItem[tokenId].dataHash;
    uint firstProportion = _idToNftItem[tokenId].firstProportion;
    bool sustainProportion = _idToNftItem[tokenId].sustainProportion;
    uint proportion = _idToNftItem[tokenId].proportion;

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
        }else if ( proportion == 0 ){  //增值按比例分给机构和拥有者
          payable(testOrg).transfer( (price - maxPrice) * firstProportion / 100 );
          payable(owner).transfer( price - (price - maxPrice) * firstProportion / 100 );
        }else{  //增值按比例分给个人，剩余增值部分按比例分给机构，最后剩余价值分给拥有者
          payable(creator).transfer( (price - maxPrice) * proportion / 100 );
          payable(testOrg).transfer( ((price - maxPrice) * (100 - proportion )/ 100 )* firstProportion / 100);
          payable(owner).transfer( price - (price - maxPrice) * proportion / 100 
          - ((price - maxPrice) * (100 - proportion )/ 100 )* firstProportion / 100 );
        }
      }

      //更新历史最高价格
      _idToNftItem[tokenId].maxPrice = price;
      _HashToNftItem[dataHash].maxPrice = price;
    }

    if (price <=  maxPrice && txCount != 0){ //非首次交易但价格低于历史最高价格全部转账给拥有者
      payable(owner).transfer( price );
    }

    //更新历史交易数
    _idToNftItem[tokenId].txCount = txCount + 1;
    _HashToNftItem[dataHash].txCount = txCount + 1;
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint tokenId
  ) internal virtual{

    // super._beforeTokenTransfer(from, to, tokenId, 1); 

    if (from == address(0)) {
      _addTokenToAllTokensEnumeration(tokenId);
    } else if (from != to) {
      _removeTokenFromOwnerEnumeration(from, tokenId);
    }

    if (to == address(0)) {
      _removeTokenFromAllTokensEnumeration(tokenId);
    } else if (to != from) {
      _addTokenToOwnerEnumeration(to, tokenId);
    }
  }

  function _addTokenToAllTokensEnumeration(uint tokenId) private {
    _idToNftIndex[tokenId] = _allNfts.length;
    _allNfts.push(tokenId);
  }

  function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
    uint length = ERC721.balanceOf(to);
    _ownedTokens[to][length] = tokenId;
    _idToOwnedIndex[tokenId] = length;
  }

  function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private {
    uint lastTokenIndex = ERC721.balanceOf(from) - 1;
    uint tokenIndex = _idToOwnedIndex[tokenId];

    if (tokenIndex != lastTokenIndex) {
      uint lastTokenId = _ownedTokens[from][lastTokenIndex];

      _ownedTokens[from][tokenIndex] = lastTokenId;
      _idToOwnedIndex[lastTokenId] = tokenIndex;
    }

    delete _idToOwnedIndex[tokenId];
    delete _ownedTokens[from][lastTokenIndex];
  }

  function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _allNfts.length - 1;
    uint tokenIndex = _idToNftIndex[tokenId];
    uint lastTokenId = _allNfts[lastTokenIndex];

    _allNfts[tokenIndex] = lastTokenId;
    _idToNftIndex[lastTokenId] = tokenIndex;

    delete _idToNftIndex[tokenId];
    _allNfts.pop();
  }

  // 从messageHash和签名中恢复签名地址用于验证签名有效性
  function _recoverSigner(bytes32 dataHash, bytes memory signature) internal pure returns (address) {
      
      bytes32 message = ECDSA.toEthSignedMessageHash(dataHash);
      return ECDSA.recover(message, signature);
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

  // function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
  //   super._burn(tokenId);
  // }

  // function tokenURI(uint256 tokenId)public view override(ERC721, ERC721URIStorage)returns (string memory){
  //   return super.tokenURI(tokenId);
  // }
}
