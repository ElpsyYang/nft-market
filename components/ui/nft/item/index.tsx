/* eslint-disable @next/next/no-img-element */

import { FunctionComponent } from "react";
import { NftMeta, Nft, Idx } from "../../../../types/nft";

type NftItemProps = {
  item: Nft;
  idx: Idx;
  buyNft: (token: number, value: number) => Promise<void>;
}

function shortifyAddress(address: string) {
  return `0x****${address.slice(-4)}`
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const NftItem: FunctionComponent<NftItemProps> = ({item, idx, buyNft}) => {
  return (
    // <>
    //   <div className="flex-shrink-0">
    //     <img
    //       className={`h-full w-full object-cover`}
    //       src={item.meta.image}
    //       alt="New NFT"
    //     />
    //   </div>
    //   <div className="flex-1 bg-white p-6 flex flex-col justify-between">
    //     <div className="flex-1">
    //       <div className="flex justify-between items-center">
    //         <div className="flex items-center mt-2">
    //           <div>
    //             <img
    //               className="inline-block h-9 w-9 rounded-full"
    //               src="/images/default_avatar.png"
    //               alt=""
    //             />
    //           </div>
    //           <div className="ml-3">
    //             <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Creator</p>
    //             <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">{shortifyAddress(item.creator)}</p>
    //           </div>
    //         </div>
    //         <p className="text-sm font-medium text-indigo-600">
    //           Genomics NFT
    //         </p>
    //       </div>
    //       <div className="block mt-2">
    //         <p className="text-xl font-semibold text-gray-900">{item.meta.name}</p>
    //         <p className="mt-3 mb-3 text-base text-gray-500">{item.meta.description}</p>
    //       </div>
    //     </div>
    //     <div className="overflow-hidden mb-4">
    //       <dl className="-mx-4 -mt-4 flex flex-wrap">
    //         <div className="flex flex-col px-4 pt-4">
    //           <dt className="order-2 text-sm font-medium text-gray-500">Price</dt>
    //           <dd className="order-1 text-xl font-extrabold text-indigo-600">
    //             <div className="flex justify-center items-center">
    //               {item.price}
    //               <img className="h-6" src="/images/small-eth.webp" alt="ether icon"/>
    //             </div>
    //           </dd>
    //         </div>
    //         { item.meta.attributes.map(attribute =>
    //           <div key={attribute.trait_type} className="flex flex-col px-4 pt-4">
    //             <dt className="order-2 text-sm font-medium text-gray-500">
    //               {attribute.trait_type}
    //             </dt>
    //             <dd className="order-1 text-xl font-extrabold text-indigo-600">
    //               {attribute.value}
    //             </dd>
    //           </div>
    //         )}
    //       </dl>
    //     </div>
    //     <div>
    //       <button
    //         onClick={() => {
    //           buyNft(item.tokenId, item.price);
    //         }}
    //         type="button"
    //         className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //       >
    //         Buy
    //       </button>
    //       <button
    //         type="button"
    //         className="disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none disabled:cursor-not-allowed inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //       >
    //         Preview
    //       </button>
    //     </div>
    //   </div>
    // </>

    <>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-transparent',
          'relative py-4 pl-4 sm:pl-6 pr-3 text-sm'
        )}
      >
        <div className="font-medium text-gray-900">
          {item.meta.name}
        </div>
        <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
          <span>
            {item.meta.description} / {item.meta.description}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{item.meta.description}</span>
        </div>
        {idx !== 0 ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.meta.description}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.meta.description}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.meta.description}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="sm:hidden">{item.price}/mo</div>
        <div className="hidden sm:block">{item.price}/month</div>
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="sm:hidden">{item.price}/mo</div>
        <div className="hidden sm:block">{item.price}/month</div>
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-transparent',
          'relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium'
        )}
      >
        <button
          onClick={() => {
            buyNft(item.tokenId, item.price);
          }}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
          // disabled={plan.isCurrent}
        >
          buy<span className="sr-only">, {item.meta.name}</span>
        </button>
        {idx !== 0 ? <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" /> : null}
      </td>   
    </>
  )
}

export default NftItem;
