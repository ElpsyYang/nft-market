/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { BaseLayout } from '@ui'
import { useWeb3 } from '@providers/web3';
import { useNetwork } from '@hooks/web3';
import { ExclamationIcon, PaperClipIcon } from '@heroicons/react/solid';
import * as util from "ethereumjs-util";
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { toast } from "react-toastify";

const ALLOWED_FIELDS = ["gender", "age", "residence", "anamnesis", "document"];

const NftCreate: NextPage = () => {

  const router = useRouter();
  const nft: any = router.query;

  const {ethereum, contract} = useWeb3();
  const {network} = useNetwork();

  const signURIHash = async (URIHash: string)=> {
    const accounts = await ethereum?.request({method: "eth_requestAccounts"}) as string[];
    const account = accounts[0];
    const sign = await ethereum?.request({
      method: "personal_sign",
      params: [URIHash, account]
    })
    return {sign, account};
  }

  const buyNft = async () => {
    try {
      const URIBuffer = util.keccak256(Buffer.from(nft.dataHash, "utf-8"));
      const URIHash = util.bufferToHex(URIBuffer);

      const {sign, account} = await signURIHash(URIHash);

      //获取metamask加密公钥
      const metaPK = await ethereum?.request({
        method: "eth_getEncryptionPublicKey",
        params: [account]
      }) as string
      
      const tx = await contract?.buyNft(
        nft.tokenId,
        sign,
        metaPK,
        {
          value: ethers.utils.parseEther(nft.price.toString())
        }
      );
      
      await toast.promise(
        tx!.wait(), {
          pending: "Buying Nft Token",
          success: "Transaction has ben created",
          error: "Transaction error"
        }
      );
    } catch(e: any) {
      console.error(e.message);
    }
  }

  if (!network.isConnectedToNetwork) {
    return (
      <BaseLayout>
        <div className="rounded-md bg-yellow-50 p-4 mt-10">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">友情提示</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                { network.isLoading ?
                  "Loading..." :
                  `请连接到 ${network.targetNetwork}`
                }
                </p>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <div>
        <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                    <div className="sm:col-span-8 lg:col-span-11">
                      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">第{nft.tokenId}号基因通证</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">创造人：{nft.creator}</p>
                        </div>
                        <div className="border-t border-gray-200">
                          <dl>
                          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">基本信息</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                性别：{nft.gender} ｜ 年龄：{nft.age} ｜ 常驻地：{nft.residence}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">交易信息</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                当前价格：{nft.price} ｜ 历史最高价格：{nft.maxPrice} ｜ 交易次数：{nft.txCount}
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">权益分配</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                                创造者分成：{nft.proportion}｜ 机构分成：{nft.firstProportion} ｜ 机构是否持续分成：{nft.sustainProportion == true? "是": "否"}
                              </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">既往史</dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 md:break-all">{nft.anamnesis}</dd>
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
                                      <a href={nft.data} className="font-medium text-indigo-600 hover:text-indigo-500">
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
                                      <a href={nft.document} className="font-medium text-indigo-600 hover:text-indigo-500">
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
                        
                        
                        <button onClick={buyNft}
                            type="button"
                            className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            确认并签名交易
                        </button>
                      </form>
                    </section>
                  </div>
                  </div>
      </div>
    </BaseLayout>
  )
}

export default NftCreate
