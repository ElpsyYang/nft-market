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
    string encryptedKey;     //加密后秘钥

    address consumer;        //基因数据消费者地址
    bytes consumerSign;      //消费者对hash的签名
  }

  uint public listingPrice = 0.025 ether;

  Counters.Counter public _listedItems;
  Counters.Counter public _tokenIds;

  mapping(address => bool) public testOrgList;

  mapping(string => bool) private _usedTokenURIs;
  mapping(uint => NftItem) private _idToNftItem;
  mapping(bytes32 => NftItem) public _HashToNftItem;

  mapping(address => mapping(uint => uint)) private _ownedTokens;
  mapping(uint => uint) private _idToOwnedIndex;

  uint256[] private _allNfts;
  mapping(uint => uint) private _idToNftIndex;

  constructor() ERC721("GenomesNFT", "GNFT") {}

  function setListingPrice(uint newPrice) external onlyOwner {
    require(newPrice > 0, "Price must be at least 1 wei");
    listingPrice = newPrice;
  }

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
}
