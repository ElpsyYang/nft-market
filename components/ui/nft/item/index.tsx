/* eslint-disable @next/next/no-img-element */

import { FunctionComponent } from "react";
import { GeneNftMeta, GeneNft, Idx } from "../../../../types/nft";


import { Fragment, useState } from 'react'
import  Link  from 'next/link'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { LogoutIcon } from '@heroicons/react/outline'
import { PaperClipIcon } from '@heroicons/react/solid'


const product = {
  name: 'Basic Tee 6-Pack ',
  price: '$192',
  rating: 3.9,
  reviewCount: 117,
  href: '#',
  imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-quick-preview-02-detail.jpg',
  imageAlt: 'Two each of gray, white, and black shirts arranged on table.',

}

type NftItemProps = {
  item: GeneNft;
  idx: Idx;
  buyNft: (token: number, consumerSign: string, consumerPubKey: string, value: number) => Promise<void>;
}

// function shortifyAddress(address: string) {
//   return `0x****${address.slice(-4)}`
// }

function shortifyAnamnesis(anamnesis: string) {
  return `${anamnesis.slice(0,6)}...`
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const NftItem: FunctionComponent<NftItemProps> = ({item, idx, buyNft}) => {

  const [open, setOpen] = useState(false)

  return (
    <>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-transparent',
          'relative py-4 pl-4 sm:pl-6 pr-3 text-sm'
        )}
      >
        <div className="font-medium text-gray-900">
          {item.tokenId}
        </div>
        {/* <div className="mt-1 flex flex-col text-gray-500 sm:block lg:hidden">
          <span>
            {item.meta.description} / {item.meta.description}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>{item.meta.description}</span>
        </div> */}
        {idx !== 0 ? <div className="absolute right-0 left-6 -top-px h-px bg-gray-200" /> : null}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.meta.gender}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.meta.age}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.meta.residence}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.firstProportion}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.sustainProportion ? "是":"否"}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.proportion}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {item.txCount}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="sm:hidden">{item.maxPrice}</div>
        <div className="hidden sm:block">{item.maxPrice}</div>
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="sm:hidden">{item.price}</div>
        <div className="hidden sm:block">{item.price}</div>
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {shortifyAnamnesis(item.meta.anamnesis)}
      </td>
      <td
        className={classNames(
          idx === 0 ? '' : 'border-t border-transparent',
          'relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium'
        )}
      >

        <button
          onClick={() => setOpen(true)}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
          disabled={false}
        >
          查看详情<span className="sr-only">, {item.meta.residence}</span>
        </button>
        
        
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
            </Transition.Child>
  
            <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                enterTo="opacity-100 translate-y-0 md:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 md:scale-100"
                leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              >
                <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <LogoutIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                    <div className="sm:col-span-8 lg:col-span-11">
                      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">第{item.tokenId}号基因通证</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">创造人：{item.creator}</p>
                        </div>
                        <div className="border-t border-gray-200">
                          <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">基本信息</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                性别：{item.meta.gender} ｜ 年龄：{item.meta.age} ｜ 常驻地：{item.meta.residence}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">交易信息</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                当前价格：{item.price} ｜ 历史最高价格：{item.maxPrice} ｜ 交易次数：{item.txCount}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">权益分配</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                创造者分成：{item.proportion}｜ 机构分成：{item.firstProportion} ｜ 机构是否持续分成：{item.sustainProportion == true? "是": "否"}
                              </dd>
                            </div>
                            
                            
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">既往史</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 md:break-all">{item.meta.anamnesis}</dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">基因数据及证明文件</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                    <div className="flex w-0 flex-1 items-center">
                                      <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                      <span className="ml-2 w-0 flex-1 truncate">加密基因数据</span>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                      <a href={item.data} className="font-medium text-indigo-600 hover:text-indigo-500">
                                        下载数据
                                      </a>
                                    </div>
                                  </li>
                                  <li className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
                                    <div className="flex w-0 flex-1 items-center">
                                      <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                                      <span className="ml-2 w-0 flex-1 truncate">证明文件</span>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                      <a href={item.meta.document} className="font-medium text-indigo-600 hover:text-indigo-500">
                                        下载数据
                                      </a>
                                    </div>
                                  </li>
                                </ul>
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                      <section aria-labelledby="options-heading" className="mt-10">
                      <form>
                        <div className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <Link 
                            href={{ pathname: '/nft/buy', 
                            query: { 
                              creator: item.creator,
                              isListed: item.isListed,
                              price: item.price,
                              tokenId: item.tokenId,
                              state: item.state,
                              maxPrice: item.maxPrice,
                              txCount: item.txCount,
                              testOrg: item.testOrg,
                              data: item.data,
                              dataHash: item.dataHash,
                              orgSign: item.orgSign,
                              firstProportion: item.firstProportion,
                              sustainProportion: item.sustainProportion,
                              sign: item.sign,
                              proportion: item.proportion,
                              encryptedKey: item.encryptedKey,
                              consumer: item.consumer,
                              consumerSign: item.consumerSign,
                              consumerKey: item.consumerKey,
                              gender: item.meta.gender,
                              age: item.meta.age,
                              residence: item.meta.residence,
                              anamnesis: item.meta.anamnesis,
                              document: item.meta.document 
                             } 
                            }}>
                            <a>购买此基因通证</a>
                          </Link>
                        </div>
                        
                        {/* <button onClick={() => {


                            console.log(item)

                            buyNft(item.tokenId, item.price);
                            }}
                            type="button"
                            className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            购买此基因通证
                        </button> */}
                      </form>
                    </section>
                  </div>
                </div>
              </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
            </div>
          </Dialog>
        </Transition.Root>
        {idx !== 0 ? <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" /> : null}
      </td>   
    </>
  )
}

export default NftItem;
