


import { useListedNfts } from "@hooks/web3";
import { FunctionComponent } from "react";
import NftItem from "../item";


const NftList: FunctionComponent = () => {
  const { nfts } = useListedNfts();

  return (
    // <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
    //   { nfts.data?.map(nft =>
    //     <div key={nft.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
    //       <NftItem
    //         item={nft}
    //         buyNft={nfts.buyNft}
    //       />
    //     </div>
    //   )}
    // </div>


    <div className="px-4 sm:px-6 lg:px-8">
      <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Plan
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Memory
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                CPU
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
              >
                Storage
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Price
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {nfts.data?.map((nft, Idx) => (
              <tr key={nft.meta.image}>
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
