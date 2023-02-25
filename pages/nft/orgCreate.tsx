/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react';
import { BaseLayout } from '@ui'
import { Switch } from '@headlessui/react'
import Link from 'next/link'
import { GeneNftCore, NftMeta, PinataRes } from '@_types/nft';
import axios from 'axios';
import { useWeb3 } from '@providers/web3';
import { ethers } from 'ethers';
import { toast } from "react-toastify";
import { useNetwork } from '@hooks/web3';
import { ExclamationIcon } from '@heroicons/react/solid';
import * as util from "ethereumjs-util";

const ALLOWED_FIELDS = ["name", "description", "image", "attributes"];

const NftCreate: NextPage = () => {
  

  const {ethereum, contract} = useWeb3();
  const {network} = useNetwork();
  const [data, setData] = useState("");
  const [dataHash, setDataHash] = useState("");
  const [orgSig, setOrgSig] = useState("");
  const [firstProportion, setFirstProportion] = useState("请输入0-100的整数");
  const [sustainProportion, setSustainProportion] = useState(false);
  const [hasData, setHasData] = useState(false);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }


  const getSignedData = async () => {
    const messageToSign = await axios.get("/api/verify");
    const accounts = await ethereum?.request({method: "eth_requestAccounts"}) as string[];
    const account = accounts[0];

    const signedData = await ethereum?.request({
      method: "personal_sign",
      params: [JSON.stringify(messageToSign.data), account, messageToSign.data.id]
    })

    return {signedData, account};
  }

  const signHash = async (dataHash: string, account: string)=> {
    const sign = await ethereum?.request({
      method: "personal_sign",
      params: [dataHash, account]
    })
    return sign;
  }

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      console.error("Select a file");
      return;
    }

    const file = e.target.files[0];

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    try {
      const {signedData, account} = await getSignedData();

      const promise = axios.post("/api/verify-file", {
        address: account,
        signature: signedData,
        bytes,
        contentType: "application/octet-stream",
        fileName: file.name.replace(/\.[^/.]+$/, "")
      });

      const res = await toast.promise(
        promise, {
          pending: "正在上传数据",
          success: "数据上传已完成",
          error: "数据上传异常，请重试"
        }
      )

      const data = res.data as PinataRes;

      
      const dataURI = `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`;

      setData(dataURI);
      setHasData(true);

      //生成dataURI的哈希，以buffer形式
      const URIBuffer = util.keccak256(Buffer.from(dataURI, "utf-8"));
      //生成16进制的URI哈希值
      const dataHash = util.bufferToHex(URIBuffer);

      setDataHash(dataHash);

      //用metamask personal_sign生成string签名
      const sign = await signHash(dataHash, account) as string;

      setOrgSig(sign);

    } catch(e: any) {
      console.error(e.message);
    }
  }

  const setNftOrgInfo = async () => {
    try {
      
      const accounts = await ethereum?.request({method: "eth_requestAccounts"}) as string[];
      
      const tx = await contract?.setNftOrgInfo(
        accounts[0],
        data,
        dataHash,
        orgSig,
        firstProportion,
        sustainProportion
      );


      
      await toast.promise(
        tx!.wait(), {
          pending: "正在上传机构签名信息",
          success: "机构信息上传已完成",
          error: "机构信息更新失败，请重试"
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
        { 
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">创建新的基因数据通证</h3>
              <p className="mt-1 text-sm text-gray-600">
                请基因检测机构上传通过AES256算法加密后的基因数据。
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  
                  { hasData ?
                    <div className='mb-4 p-4'>
                      <div className="font-bold">Your metadata: </div>
                       <div>
                        <Link href={data}>
                          <a className="underline text-indigo-600">
                          {data}
                          </a>
                        </Link>
                      </div>
                    </div>
                     :
                    <div>
                      <label className="block text-sm font-medium text-gray-700">加密后的基因数据</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>请上传加密后的基因数据</span>
                              <input
                                onChange={handleFile}
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">或将加密后的数据文件拖拽至此处</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        基因数据通证哈希
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          disabled = {true}
                          value={dataHash}
                          type="text"
                          name="dataHash"
                          id="dataHash"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="文件上传成功后自动生成，无需填写"
                        />
                      </div>
                    </div>
                </div>

                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        机构分成比例
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e) => setFirstProportion(e.target.value)}
                          value={firstProportion}
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="请输入0-100的整数"
                        />
                      </div>
                    </div>
                </div>

                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div className="flex">
                    <div className="mr-2 font-bold underline">点击开启持续分成</div>
                    <Switch
                      checked={sustainProportion}
                      onChange={setSustainProportion}
                      className={classNames(sustainProportion ? 'bg-indigo-600' : 'bg-gray-200','relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2')}>
                      <span className="sr-only">Use setting</span>
                      <span className={classNames(sustainProportion ? 'translate-x-5' : 'translate-x-0','pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out')}>
                        <span className={classNames(sustainProportion ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200','absolute inset-0 flex h-full w-full items-center justify-center transition-opacity')}aria-hidden="true" >
                          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                            <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span className={classNames( sustainProportion ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100','absolute inset-0 flex h-full w-full items-center justify-center transition-opacity')}aria-hidden="true">
                          <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                          </svg>
                        </span>
                      </span>
                    </Switch>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={setNftOrgInfo}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      发布
                    </button>
                </div>

                
              </div>
            </form>
          </div>
        </div>
        }
      </div>
    </BaseLayout>
  )
}

export default NftCreate
