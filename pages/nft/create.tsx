/* eslint-disable @next/next/no-img-element */

import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react';
import { BaseLayout } from '@ui'
import { Switch } from '@headlessui/react'
import Link from 'next/link'
import { NftMeta, PinataRes, GeneNftMeta } from '@_types/nft';
import axios from 'axios';
import { useWeb3 } from '@providers/web3';
import { BigNumber, ethers } from 'ethers';
import { toast } from "react-toastify";
import { useNetwork } from '@hooks/web3';
import { ExclamationIcon } from '@heroicons/react/solid';
import * as util from "ethereumjs-util";
import * as sigUtil from "@metamask/eth-sig-util";

const ALLOWED_FIELDS = ["gender", "age", "residence", "anamnesis", "document"];

const NftCreate: NextPage = () => {
  const {ethereum, contract} = useWeb3();
  const {network} = useNetwork();

  const [dataHash, setDataHash] = useState("");
  const [proportion, setProportion] = useState("请输入0-100的整数");
  const [aesKey, setAesKey] = useState("");
  const [nftURI, setNftURI] = useState("");
  const [price, setPrice] = useState("");
  const [firstProportion, setFirstProportion] = useState(0);
  const [sustainProportion, setSustainProportion] = useState(false);

  const [geneNftMeta, setGeneNftMeta] = useState<GeneNftMeta>({
    gender: "",
    age: 0,
    residence: "",
    anamnesis: "",
    document: ""
  });


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

  const signURIHash = async (URIHash: string)=> {
    const accounts = await ethereum?.request({method: "eth_requestAccounts"}) as string[];
    const account = accounts[0];
    const sign = await ethereum?.request({
      method: "personal_sign",
      params: [URIHash, account]
    })
    return {sign, account};
  }

  const encrypt = async (publicKey: string, text: string) => {
    const result = sigUtil.encrypt({
      publicKey,
      data: text,
      version: "x25519-xsalsa20-poly1305"
    });
  
    // https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
    return util.bufferToHex(Buffer.from(JSON.stringify(result), "utf8"));
  };

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
      const promise = axios.post("/api/verify-image", {
        address: account,
        signature: signedData,
        bytes,
        contentType: file.type,
        fileName: file.name.replace(/\.[^/.]+$/, "")
      });

      const res = await toast.promise(
        promise, {
          pending: "数据上传中",
          success: "数据上传成功",
          error: "数据上传失败，请重试"
        }
      )

      const data = res.data as PinataRes;

      setGeneNftMeta({
        ...geneNftMeta,
        document: `${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`
      });
    } catch(e: any) {
      console.error(e.message);
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneNftMeta({...geneNftMeta, [name]: value});
  }


  const uploadMetadata = async () => {
    try {
      const {signedData, account} = await getSignedData();
      const nft = await contract?._getNftItemByHash(dataHash);
      console.log(nft)

      setFirstProportion(  (nft?.firstProportion as BigNumber).toNumber )
      setSustainProportion( (nft?.sustainProportion) as boolean )

      const promise = axios.post("/api/verify", {
        address: account,
        signature: signedData,
        nft: geneNftMeta
      })

      const res = await toast.promise(
        promise, {
          pending: "Uploading metadata",
          success: "Metadata uploaded",
          error: "Metadata upload error"
        }
      )

      const data = res.data as PinataRes;
      setNftURI(`${process.env.NEXT_PUBLIC_PINATA_DOMAIN}/ipfs/${data.IpfsHash}`);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  const createNft = async () => {
    try {
      const nftRes = await axios.get(nftURI,{
        headers: {
          'Accept': 'text/plain'
        }
      });

      const content = nftRes.data;

      Object.keys(content).forEach(key => {
        if (!ALLOWED_FIELDS.includes(key)) {
          throw new Error("Invalid Json structure");
        }
      })
      
      const URIBuffer = util.keccak256(Buffer.from(nftURI, "utf-8"));
      const URIHash = util.bufferToHex(URIBuffer);

      const {sign, account} = await signURIHash(URIHash);

      const ECDSAsig = util.fromRpcSig(sign as string);
      const pubKeyBuffer = util.ecrecover(util.hashPersonalMessage(URIBuffer), ECDSAsig.v, ECDSAsig.r, ECDSAsig.s);
      const pubKey = util.bufferToHex(pubKeyBuffer);

      //获取metamask加密公钥
      const metaPK = await ethereum?.request({
        method: "eth_getEncryptionPublicKey",
        params: [account]
      }) as string
      //给信息加密
      const encryptedKey = await encrypt(metaPK, aesKey)
      
      const tx = await contract?.mintToken(
        nftURI,
        ethers.utils.parseEther(price), 
        dataHash,
        sign,
        proportion,
        encryptedKey,
        {
          value: ethers.utils.parseEther(0.025.toString())
        }
      );
      
      await toast.promise(
        tx!.wait(), {
          pending: "通证制造中",
          success: "通证制造完成，请前往个人信息查看",
          error: "通证制造失败，请重试"
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
       
        { nftURI ?
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">发布基因数据</h3>
                <p className="mt-1 text-sm text-gray-600">
                  基因数据将会被公布在发布后将会公布在数据库中。
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  
                  { nftURI &&
                    <div className='mb-4 p-4'>
                      <div className="font-bold">您的个人数据地址: </div>
                      <div>
                        <Link href={nftURI}>
                          <a className="underline text-indigo-600">
                            {nftURI}
                          </a>
                        </Link>
                      </div>
                    </div>
                  }

                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      机构分成比例
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        value={firstProportion}
                        type="number"
                        name="firstProportion"
                        id="firstProportion"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        disabled = {true}
                      />
                    </div>
                  </div>

                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      机构是否持续分红
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        value={sustainProportion? "是":"否"}
                        type="text"
                        name="sustainProportion"
                        id="sustainProportion"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder={sustainProportion? "是":"否"}
                        disabled = {true}
                      />
                    </div>
                  </div>
                  
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        加密密钥
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          value={aesKey}
                          onChange={(e) => setAesKey(e.target.value)}
                          type="text"
                          name="aesKey"
                          id="aesKey"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="请输入密码原文密钥，系统自动生成加密密钥"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        通证价格
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e) => setPrice(e.target.value)}
                          value={price}
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="请输入通证价格"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        分成比例
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={(e) => setProportion(e.target.value)}
                          value={proportion}
                          type="number"
                          name="proportion"
                          id="proportion"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="请输入0-100的整数作为自身后续分成比例的百分制"
                        />
                      </div>
                    </div>
                  </div>
   
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={createNft}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      制造基因数据通证
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        :
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">创建新的基因元数据</h3>
              <p className="mt-1 text-sm text-gray-600">
                表单信息将会被展示在基因数据库，请按需填写。
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">


                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      基因数据地址哈希
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        value={dataHash}
                        onChange={(e) => setDataHash(e.target.value)}
                        type="text"
                        name="dataHash"
                        id="dataHash"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="请填写测序机构生成的地址哈希"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      性别
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        value={geneNftMeta.gender}
                        onChange={handleChange}
                        type="text"
                        name="gender"
                        id="gender"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="请输入性别"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      年龄
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        value={geneNftMeta.age}
                        onChange={handleChange}
                        type="text"
                        name="age"
                        id="age"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="请输入年龄"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      常驻地
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        value={geneNftMeta.residence}
                        onChange={handleChange}
                        type="text"
                        name="residence"
                        id="residence"
                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        placeholder="请输入常驻地"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      既往史
                    </label>
                    <div className="mt-1">
                      <textarea
                        value={geneNftMeta.anamnesis}
                        onChange={handleChange}
                        id="anamnesis"
                        name="anamnesis"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        placeholder="请填写本人既往病史，包括但不限于既往疾病、手术、用药、过敏史、家族史、医嘱等"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      详细的既往病史既往病史将可能使得您的基因数据更具价值
                    </p>
                  </div>

                 
                  { geneNftMeta.document ?   
                    <div className='mb-4 p-4'>
                      <div className="font-bold">您的个人数据地址: </div>
                       <div>
                        <Link href={geneNftMeta.document}>
                          <a className="underline text-indigo-600">
                          {geneNftMeta.document}
                          </a>
                        </Link>
                      </div>
                    </div> 
                    :
                    <div>
                    <label className="block text-sm font-medium text-gray-700">辅助证明资料</label>
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
                            <span>请上传病史等辅助证明材料</span>
                            <input
                              onChange={handleFile}
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">或将文件拖拽至此处</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  }
                  
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    onClick={uploadMetadata}
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    上传个人信息
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
