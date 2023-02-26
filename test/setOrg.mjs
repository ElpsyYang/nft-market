import { ethers } from "ethers";
// 利用Infura的rpc节点连接以太坊网络
// 填入Infura API Key, 教程：https://github.com/AmazingAng/WTFSolidity/blob/main/Topics/Tools/TOOL02_Infura/readme.md
const INFURA_ID = 'f6f010f3c0ee4d03854748cd9987c177'
// 连接Goerli测试网
const providerGoerli = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${INFURA_ID}`)

const privateKey = '08b23521cc6629b4b403b4b33faf1c48d504672d5214f6f9b1d1fb12dbc47b1e'
const wallet = new ethers.Wallet(privateKey, providerGoerli)

const abi = `[
			{
				"inputs": [],
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "approved",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "Approval",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "ApprovalForAll",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"indexed": false,
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"indexed": false,
						"internalType": "bool",
						"name": "isListed",
						"type": "bool"
					}
				],
				"name": "NftItemCreated",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "previousOwner",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "OwnershipTransferred",
				"type": "event"
			},
			{
				"anonymous": false,
				"inputs": [
					{
						"indexed": true,
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"indexed": true,
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "Transfer",
				"type": "event"
			},
			{
				"inputs": [
					{
						"internalType": "bytes32",
						"name": "hash",
						"type": "bytes32"
					}
				],
				"name": "_getNftItemByHash",
				"outputs": [
					{
						"components": [
							{
								"internalType": "enum NftMarket.NftState",
								"name": "state",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "tokenId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "maxPrice",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "creator",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "isListed",
								"type": "bool"
							},
							{
								"internalType": "uint256",
								"name": "txCount",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "testOrg",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "data",
								"type": "string"
							},
							{
								"internalType": "bytes32",
								"name": "dataHash",
								"type": "bytes32"
							},
							{
								"internalType": "bytes",
								"name": "orgSign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "firstProportion",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "sustainProportion",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "sign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "proportion",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "encryptedKey",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "consumer",
								"type": "address"
							},
							{
								"internalType": "bytes",
								"name": "consumerSign",
								"type": "bytes"
							},
							{
								"internalType": "string",
								"name": "consumerKey",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "consumerPubKey",
								"type": "string"
							}
						],
						"internalType": "struct NftMarket.NftItem",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "approve",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					}
				],
				"name": "balanceOf",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "consumerSign",
						"type": "bytes"
					},
					{
						"internalType": "string",
						"name": "consumerPubKey",
						"type": "string"
					}
				],
				"name": "buyNft",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "consumerKey",
						"type": "string"
					}
				],
				"name": "confirmTx",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "orgAdd",
						"type": "address"
					}
				],
				"name": "containTestOrg",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getAllNftsOnSale",
				"outputs": [
					{
						"components": [
							{
								"internalType": "enum NftMarket.NftState",
								"name": "state",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "tokenId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "maxPrice",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "creator",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "isListed",
								"type": "bool"
							},
							{
								"internalType": "uint256",
								"name": "txCount",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "testOrg",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "data",
								"type": "string"
							},
							{
								"internalType": "bytes32",
								"name": "dataHash",
								"type": "bytes32"
							},
							{
								"internalType": "bytes",
								"name": "orgSign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "firstProportion",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "sustainProportion",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "sign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "proportion",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "encryptedKey",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "consumer",
								"type": "address"
							},
							{
								"internalType": "bytes",
								"name": "consumerSign",
								"type": "bytes"
							},
							{
								"internalType": "string",
								"name": "consumerKey",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "consumerPubKey",
								"type": "string"
							}
						],
						"internalType": "struct NftMarket.NftItem[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getApproved",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "getNftItem",
				"outputs": [
					{
						"components": [
							{
								"internalType": "enum NftMarket.NftState",
								"name": "state",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "tokenId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "maxPrice",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "creator",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "isListed",
								"type": "bool"
							},
							{
								"internalType": "uint256",
								"name": "txCount",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "testOrg",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "data",
								"type": "string"
							},
							{
								"internalType": "bytes32",
								"name": "dataHash",
								"type": "bytes32"
							},
							{
								"internalType": "bytes",
								"name": "orgSign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "firstProportion",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "sustainProportion",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "sign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "proportion",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "encryptedKey",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "consumer",
								"type": "address"
							},
							{
								"internalType": "bytes",
								"name": "consumerSign",
								"type": "bytes"
							},
							{
								"internalType": "string",
								"name": "consumerKey",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "consumerPubKey",
								"type": "string"
							}
						],
						"internalType": "struct NftMarket.NftItem",
						"name": "",
						"type": "tuple"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "getOwnedNfts",
				"outputs": [
					{
						"components": [
							{
								"internalType": "enum NftMarket.NftState",
								"name": "state",
								"type": "uint8"
							},
							{
								"internalType": "uint256",
								"name": "tokenId",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "price",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "maxPrice",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "creator",
								"type": "address"
							},
							{
								"internalType": "bool",
								"name": "isListed",
								"type": "bool"
							},
							{
								"internalType": "uint256",
								"name": "txCount",
								"type": "uint256"
							},
							{
								"internalType": "address",
								"name": "testOrg",
								"type": "address"
							},
							{
								"internalType": "string",
								"name": "data",
								"type": "string"
							},
							{
								"internalType": "bytes32",
								"name": "dataHash",
								"type": "bytes32"
							},
							{
								"internalType": "bytes",
								"name": "orgSign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "firstProportion",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "sustainProportion",
								"type": "bool"
							},
							{
								"internalType": "bytes",
								"name": "sign",
								"type": "bytes"
							},
							{
								"internalType": "uint256",
								"name": "proportion",
								"type": "uint256"
							},
							{
								"internalType": "string",
								"name": "encryptedKey",
								"type": "string"
							},
							{
								"internalType": "address",
								"name": "consumer",
								"type": "address"
							},
							{
								"internalType": "bytes",
								"name": "consumerSign",
								"type": "bytes"
							},
							{
								"internalType": "string",
								"name": "consumerKey",
								"type": "string"
							},
							{
								"internalType": "string",
								"name": "consumerPubKey",
								"type": "string"
							}
						],
						"internalType": "struct NftMarket.NftItem[]",
						"name": "",
						"type": "tuple[]"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					}
				],
				"name": "isApprovedForAll",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "listedItemsCount",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "listingPrice",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "tokenURI",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "bytes32",
						"name": "dataHash",
						"type": "bytes32"
					},
					{
						"internalType": "bytes",
						"name": "sign",
						"type": "bytes"
					},
					{
						"internalType": "uint256",
						"name": "proportion",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "encryptedKey",
						"type": "string"
					}
				],
				"name": "mintToken",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "name",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "owner",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "ownerOf",
				"outputs": [
					{
						"internalType": "address",
						"name": "",
						"type": "address"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "newPrice",
						"type": "uint256"
					}
				],
				"name": "placeNftOnSale",
				"outputs": [],
				"stateMutability": "payable",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "renounceOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "safeTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					},
					{
						"internalType": "bytes",
						"name": "data",
						"type": "bytes"
					}
				],
				"name": "safeTransferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "operator",
						"type": "address"
					},
					{
						"internalType": "bool",
						"name": "approved",
						"type": "bool"
					}
				],
				"name": "setApprovalForAll",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "newPrice",
						"type": "uint256"
					}
				],
				"name": "setListingPrice",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "testOrg",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "data",
						"type": "string"
					},
					{
						"internalType": "bytes32",
						"name": "dataHash",
						"type": "bytes32"
					},
					{
						"internalType": "bytes",
						"name": "orgSign",
						"type": "bytes"
					},
					{
						"internalType": "uint256",
						"name": "firstProportion",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "sustainProportion",
						"type": "bool"
					}
				],
				"name": "setNftOrgInfo",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "orgAdd",
						"type": "address"
					}
				],
				"name": "setTestOrg",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "bytes4",
						"name": "interfaceId",
						"type": "bytes4"
					}
				],
				"name": "supportsInterface",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "symbol",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"name": "tokenByIndex",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "index",
						"type": "uint256"
					}
				],
				"name": "tokenOfOwnerByIndex",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "tokenURI",
				"outputs": [
					{
						"internalType": "string",
						"name": "",
						"type": "string"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "string",
						"name": "tokenURI",
						"type": "string"
					}
				],
				"name": "tokenURIExists",
				"outputs": [
					{
						"internalType": "bool",
						"name": "",
						"type": "bool"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [],
				"name": "totalSupply",
				"outputs": [
					{
						"internalType": "uint256",
						"name": "",
						"type": "uint256"
					}
				],
				"stateMutability": "view",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "from",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "to",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "tokenId",
						"type": "uint256"
					}
				],
				"name": "transferFrom",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			},
			{
				"inputs": [
					{
						"internalType": "address",
						"name": "newOwner",
						"type": "address"
					}
				],
				"name": "transferOwnership",
				"outputs": [],
				"stateMutability": "nonpayable",
				"type": "function"
			}
		]`;

const contract_address = "0xE95BF186330A94b165F989FFD18d45187d298b86";
const contract = new ethers.Contract(contract_address, abi, wallet)

const main = async () => {
    const tx = await contract.setTestOrg("0xFD7b803913Eaf7d90BD8e88f8656Fd289f314C97")
// 等待链上确认交易
    await tx.wait() 
    console.log(tx)

    console.log('_________________')
    const tx2 = await contract.containTestOrg("0xFD7b803913Eaf7d90BD8e88f8656Fd289f314C97")
// 等待链上确认交易
    await tx2.wait() 
    console.log(tx2)
}
main()
