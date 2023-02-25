/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'

import { GeneNft, Idx } from '@_types/nft';
import { useOwnedNfts } from '@hooks/web3';
import { Fragment, useEffect, useState } from 'react';

import { ethers } from 'ethers';
import  Link  from 'next/link'
import { Dialog, RadioGroup, Transition } from '@headlessui/react'
import { LogoutIcon } from '@heroicons/react/outline'
import { PaperClipIcon } from '@heroicons/react/solid'


const tabs = [
  { name: '待确认交易的通证', href: '/confirm', current: false },
  { name: '拥有的基因通证', href: '/profile', current: true },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function shortifyAnamnesis(anamnesis: string) {
  return `${anamnesis.slice(0,6)}...`
}

const Profile: NextPage = () => {
  
  let { nfts }  = useOwnedNfts();
  const [open, setOpen] = useState(false);
  const [newPrice, setNewPrice] = useState("0");

  const [activeNft, setActiveNft] = useState<GeneNft>();

  const openAndActive = async (nft : GeneNft) => {
    setOpen(true);
    setActiveNft(nft);
  }

  //测试用数据
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
  //     isListed: false,
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

  // nfts.data = []


  useEffect(() => {
    setActiveNft(activeNft);


    return () => setActiveNft(undefined)
  }, [activeNft])


  


  return (
    <BaseLayout>
      <div className="h-full flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-stretch overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex">
                  <h1 className="flex-1 text-2xl font-bold text-gray-900">您的基因数据</h1>
                </div>
                <div className="mt-3 sm:mt-2">
                  <div className="hidden sm:block">
                    <div className="flex items-center border-b border-gray-200">
                      <nav className="flex-1 -mb-px flex space-x-6 xl:space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={tab.current ? 'page' : undefined}
                            className={classNames(
                              tab.current
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                          >
                            {tab.name}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>

                <section className="mt-8 pb-16" aria-labelledby="gallery-heading">


                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
            <tr>
              <th scope="col" className="text-center py-3.5 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                ID
              </th>
              <th
                scope="col"
                className="text-center hidden px-3 py-3.5 text-sm font-semibold text-gray-900 lg:table-cell"
              >
                性别
              </th>
              <th
                scope="col"
                className="text-center hidden px-3 py-3.5 text-sm font-semibold text-gray-900 lg:table-cell"
              >
                年龄
              </th>
              <th
                scope="col"
                className="text-center hidden px-3 py-3.5 text-sm font-semibold text-gray-900 lg:table-cell"
              >
                常住地
              </th>
              <th
                scope="col"
                className="text-center hidden px-3 py-3.5 text-sm font-semibold text-gray-900 lg:table-cell"
              >
                检测机构分成
              </th>
              <th
                scope="col"
                className="text-center hidden px-3 py-3.5 text-sm font-semibold text-gray-900 lg:table-cell"
              >
                基因拥有者分成
              </th>
              <th scope="col" className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                最高价格
              </th>
              <th scope="col" className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                当前价格
              </th>
              <th scope="col" className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                既往史
              </th>
              <th scope="col" className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                详情
              </th>
              <th scope="col" className="text-center px-3 py-3.5 text-sm font-semibold text-gray-900">
                设定新价格
              </th>
              <th
                scope="col"
                className="text-center hidden px-3 py-3.5 text-sm font-semibold text-gray-900 lg:table-cell"
              >
                开放共享
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Select</span>
              </th>
            </tr>
                    </thead>
                    <tbody>
                      { (nfts.data as GeneNft[]).map((nft, idx) => (
                        <tr key={nft.tokenId}>

                          {/* tokenId */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'border-t border-transparent',
          'relative py-4 pl-4 sm:pl-6 pr-3 text-sm text-center '
        )}
      >
        <div className="font-medium text-gray-900">
          {nft.tokenId}
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


                          {/* 性别 */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {nft.meta.gender}
                          </td>

                          {/* 年龄 */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {nft.meta.age}
                          </td>


                          {/* 常驻地 */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {nft.meta.residence}
                          </td>

                          {/* 检测机构分成 */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {nft.firstProportion}
                          </td>

                          {/* 创造者分成 */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200',
          'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
        )}
      >
        {nft.proportion}
                          </td>

                          {/* 最高价格 */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="sm:hidden">{nft.maxPrice}</div>
        <div className="hidden sm:block">{nft.maxPrice}</div>
                          </td>

                          {/* 当前价格 */}
                          <td
        className={classNames(
          idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200',
          'px-3 py-3.5 text-sm text-gray-500'
        )}
      >
        <div className="sm:hidden">{nft.price}</div>
        <div className="hidden sm:block">{nft.price}</div>
                          </td>

                          {/* 既往史 */}
                          <td className={classNames(idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200','hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell')}>
                            {shortifyAnamnesis(nft.meta.anamnesis)}
                          </td>

                          {/* 查看详情按钮和跳出框 */}
                          <td className={classNames(idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200','hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell')}>
                            <button
                              onClick={() => openAndActive(nft)}
                              // onClick={() => setOpen(true)}
                              type="button"
                              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                              disabled={false}>
                              点击查看详情
                            </button>

                            { activeNft && 
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
                          <h3 className="text-lg font-medium leading-6 text-gray-900">第{(activeNft as GeneNft).tokenId}号基因通证</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">创造人：{(activeNft as GeneNft).creator}</p>
                        </div>
                        <div className="border-t border-gray-200">
                          <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">基本信息</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                性别：{(activeNft as GeneNft).meta.gender} ｜ 年龄：{(activeNft as GeneNft).meta.age} ｜ 常驻地：{(activeNft as GeneNft).meta.residence}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">交易信息</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                当前价格：{(activeNft as GeneNft).price} ｜ 历史最高价格：{(activeNft as GeneNft).maxPrice} ｜ 交易次数：{(activeNft as GeneNft).txCount}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">权益分配</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                创造者分成：{(activeNft as GeneNft).proportion}｜ 机构分成：{(activeNft as GeneNft).firstProportion} ｜ 机构是否持续分成：{(activeNft as GeneNft).sustainProportion == true? "是": "否"}
                              </dd>
                            </div>
                            
                            
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">既往史</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 md:break-all">{(activeNft as GeneNft).meta.anamnesis}</dd>
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
                                      <a href={(activeNft as GeneNft).data} className="font-medium text-indigo-600 hover:text-indigo-500">
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
                                      <a href={(activeNft as GeneNft).meta.document} className="font-medium text-indigo-600 hover:text-indigo-500">
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
                      
                    </section>
                  </div>
                </div>
              </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
            </div>
          </Dialog>
                            </Transition.Root>}
                          </td>


                          {/* 新价格输入框 */}
                          <td className={classNames(idx === 0 ? 'text-center ' : 'text-center border-t border-gray-200','hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell')}>
                            
                          { nft.isListed || nft.state != 1 ?
                          "当前通证不可更改价格":
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              onChange={(e) => setNewPrice(e.target.value)}
                              value={newPrice}
                              type="text"
                              name="newPrice"
                              id="newPrice"
                              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              placeholder="0.00"
                              aria-describedby="price-currency"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="text-gray-500 sm:text-sm" id="price-currency">
                                ETH
                              </span>
                            </div>
                          </div>
                          }
                          </td>


                          {/* 开放共享按钮 */}
                          <td className={classNames(idx === 0 ? 'text-center ' : 'text-center border-t border-transparent','relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-medium')}>
                            <button
                              disabled={nft.isListed || nft.state != 1}
                              onClick={() => {
                                nfts.listNft(
                                nft.tokenId,
                                newPrice
                                )
                              }}
                              type="button"
                              className="disabled:text-gray-400 disabled:cursor-not-allowed flex-1 ml-3 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                               {nft.isListed ? "已共享": "开放共享"}
                               {idx !== 0 ? <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" /> : null}
                             </button>
                          {idx !== 0 ? <div className="absolute right-6 left-0 -top-px h-px bg-gray-200" /> : null}
                          </td>   
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                </section>
                </div>
            </main>

          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default Profile
