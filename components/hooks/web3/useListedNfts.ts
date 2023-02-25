
import { CryptoHookFactory } from "@_types/hooks";
import { GeneNft } from "@_types/nft";
import { BigNumber, ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

type UseListedNftsResponse = {
  buyNft: (token: number, consumerSign: string, consumerPubKey: string,value: number) => Promise<void>
}
type ListedNftsHookFactory = CryptoHookFactory<GeneNft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useListedNfts" : null,
    async () => {
      const nfts = [] as GeneNft[];
      const coreNfts = await contract!.getAllNftsOnSale();

      for (let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i];
        const tokenURI = await contract!.tokenURI(item.tokenId);
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();

        

        nfts.push({
          price: parseFloat(ethers.utils.formatEther(item.price)),
          tokenId: item.tokenId.toNumber(),
          creator: item.creator,
          isListed: item.isListed,
          state: item.state,
          maxPrice: parseFloat(ethers.utils.formatEther(item.maxPrice)),
          txCount: item.txCount.toNumber(),
          testOrg: item.testOrg,
          data: item.data,
          dataHash: item.dataHash,
          orgSign: item.orgSign,
          firstProportion: (item.firstProportion).toNumber(),
          sustainProportion: item.sustainProportion,
          sign: item.sign,
          proportion: (item.proportion).toNumber(),
          encryptedKey: item.encryptedKey,
          consumer: item.consumer,
          consumerSign: item.consumerSign,
          consumerKey: item.consumerKey,
          consumerPubKey: item.consumerPubKey,
          meta
        })
      }
      
      return nfts;
    }
  )

  const _contract = contract;
  const buyNft = useCallback(async (tokenId: number, consumerSign: string, consumerPubKey: string,value: number) => {
    try {
      const result = await _contract!.buyNft(
        tokenId, 
        consumerSign,
        consumerPubKey,
        {
          value: ethers.utils.parseEther(value.toString())
        }
      )

      await toast.promise(
        result!.wait(), {
          pending: "Processing transaction",
          success: "Nft is yours! Go to Profile page",
          error: "Processing error"
        }
      );
    } catch (e: any) {
      console.error(e.message);
    }
  }, [_contract])


  return {
    ...swr,
    buyNft,
    data: data || [],
  };
}
