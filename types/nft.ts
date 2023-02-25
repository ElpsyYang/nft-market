
export type Trait = "attack" | "health" | "speed";

export type NftAttribute = {
  trait_type: Trait;
  value: string;
}

export type NftMeta = {
  name: string;
  description: string;
  image: string;
  attributes: NftAttribute[];
}

export type NftCore = {
  tokenId: number;
  price: number;
  creator: string;
  isListed: boolean
}

export type Nft = {
  meta: NftMeta
} & NftCore

export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
}

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}

export type Idx = number


export type GeneNftMeta = {
  gender: string;
  age: number;
  residence: string;
  anamnesis: string;
  document: string;
}

export type GeneNftCore = {
  state: number;
  tokenId: number;
  price: number;
  maxPrice: number;
  creator: string;
  isListed: boolean;
  txCount: number;
  testOrg: string;
  data: string;
  dataHash: string;
  orgSign: string;
  firstProportion: number;
  sustainProportion: boolean;
  sign: string;
  proportion: number;
  encryptedKey: string;
  consumer: string;
  consumerSign: string;
  consumerKey: string;
  consumerPubKey: string;
}

export type GeneNft = {
  meta: GeneNftMeta
} & GeneNftCore