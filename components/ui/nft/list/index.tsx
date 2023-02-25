


import { useListedNfts } from "@hooks/web3";
import { FunctionComponent, useState, useEffect} from "react";
import NftItem from "../item";
import { GeneNft } from '@_types/nft';


const NftList: FunctionComponent = () => {
  
  let { nfts } = useListedNfts();

  console.log(nfts)
  const [activeNfts, setActiveNfts] = useState<GeneNft[]>(nfts.data as GeneNft[]);
  const [ keyword, setKeyword ] = useState("")

  //测试用数据，用完删除
  // nfts.data = [
  //   {
  //     creator: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     isListed: true,
  //     price: 0.5,
  //     tokenId: 1,
  //     state: 1,
  //     maxPrice: 2,
  //     txCount: 10,
  //     testOrg: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     data: "https://gateway.pinata.cloud/ipfs/QmbiE5ZdZb97C7WuCmbSQ6o7yHn4FRroojwmGDLtevPHC7",
  //     dataHash: "0x4b64764748519caa2736a389b3a848ffab039223c6cfbc5dbbb1eabd2fac3b91",
  //     orgSign: "0x8a5699e6f3f1f5d26d89f2391525e12c5e31246e1ea70f41f08d052e02184d993ca703c5c62502f6d1de3e4430dd3d8e6d19b6f4b9e8fe83f0aea9d6a2ad2d3c1c",
  //     firstProportion: 30,
  //     sustainProportion: true,
  //     sign: "0x8a5699e6f3f1f5d26d89f2391525e12c5e31246e1ea70f41f08d052e02184d993ca703c5c62502f6d1de3e4430dd3d8e6d19b6f4b9e8fe83f0aea9d6a2ad2d3c1c",
  //     proportion: 80,
  //     encryptedKey: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     consumer: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     consumerSign: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     consumerKey: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",

  //     meta: {
  //       gender: "男",
  //       age: 25,
  //       residence: "上海",
  //       anamnesis: "心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要心脏病糖尿病不行了要",
  //       document: "https://gateway.pinata.cloud/ipfs/QmbiE5ZdZb97C7WuCmbSQ6o7yHn4FRroojwmGDLtevPHC7"
  //     }
  //   },
  //   {
  //     creator: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     isListed: true,
  //     price: 25,
  //     tokenId: 2,
  //     state: 1,
  //     maxPrice: 50,
  //     txCount: 25,
  //     testOrg: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     data: "https://gateway.pinata.cloud/ipfs/QmbiE5ZdZb97C7Wun4FRroojwmGDLtevPHC7",
  //     dataHash: "0x4b64764748519caa2736a389b3a848ffab039223c6cfbc5dbbb1eabd2fac3b91",
  //     orgSign: "0x8a5699e6f3f1f5d26d89f2391525e12c5e31246e1ea70f41f08d052e02184d993ca703c5c62502f6d1de3e4430dd3d8e6d19b6f4b9e8fe83f0aea9d6a2ad2d3c1c",
  //     firstProportion: 20,
  //     sustainProportion: false,
  //     sign: "0x8a5699e6f3f1f5d26d89f2391525e12c5e31246e1ea70f41f08d052e02184d993ca703c5c62502f6d1de3e4430dd3d8e6d19b6f4b9e8fe83f0aea9d6a2ad2d3c1c",
  //     proportion: 70,
  //     encryptedKey: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     consumer: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     consumerSign: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",
  //     consumerKey: "0x162165b366ae0C43B40Eb5773eF5Ced19bdDCe16",

  //     meta: {
  //       gender: "女",
  //       age: 30,
  //       residence: "北京",
  //       anamnesis: "健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康健康贼健康",
  //       document: "https://gateway.pinata.cloud/ipfs/QmbiE5ZdZb97C7WuCmbSQ6o7yHn4FRroojwmGDLtevPHC7"
  //     }
  //   }
  // ]
  // //测试用数据，用完可以删了
  // nfts.buyNft = async (tokenid,value) => {}

  useEffect(() => {
    setActiveNfts(activeNfts);
    // return () => setActiveNfts([])
  }, [activeNfts])

  const search = async () => {
    nfts.data = nfts.data?.filter( nft => nft.meta.anamnesis.includes(keyword))
    setActiveNfts(nfts.data as GeneNft[])
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
 
        {/* 搜索栏 */}
        <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg">
          <div className="relative mt-1 flex items-center">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="输入关键字快速检索"
              value={keyword} 
              onChange={(e) => setKeyword(e.target.value)}
              className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button 
                type = "button"
                onClick={search}
                className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
                快速搜索
              </button>
            </div>
          </div>
        </div>
        
        {/* 表格主体 */}
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                ID
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                性别
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                年龄
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                常住地
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                检测机构分成
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                机构是否持续分成
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                基因拥有者分成
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                交易次数
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                最高价格
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                当前价格
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                既往史
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody>
            { (activeNfts as GeneNft[]).map((nft, Idx) => (
              <tr key={nft.data}>
                <NftItem
                  item={nft}
                  idx={Idx}
                  buyNft={nfts.buyNft}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    
  )
}

export default NftList;
