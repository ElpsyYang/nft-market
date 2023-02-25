
import { CryptoHookFactory } from "@_types/hooks";
import { GeneNft } from "@_types/nft";
import { ethers } from "ethers";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

type UseConfirmNftsResponse = {
  listNft: (tokenId: number, price: string) => Promise<void>
}
type confirmNftsHookFactory = CryptoHookFactory<GeneNft[], UseConfirmNftsResponse>

export type UseConfirmNftsHook = ReturnType<confirmNftsHookFactory>

export const hookFactory: confirmNftsHookFactory = ({contract}) => () => {
  const {data, ...swr} = useSWR(
    contract ? "web3/useConfirmNfts" : null,
    async () => {
      const nfts = [] as GeneNft[];
      const coreNfts = await contract!.getOwnedNfts();

      for (let i = 0; i < coreNfts.length; i++) {
        const item = coreNfts[i];
        if (item.state == 2 ){
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
          firstProportion: item.firstProportion.toNumber(),
          sustainProportion: item.sustainProportion,
          sign: item.sign,
          proportion: item.proportion.toNumber(),
          encryptedKey: item.encryptedKey,
          consumer: item.consumer,
          consumerSign: item.consumerSign,
          consumerKey: item.consumerKey,
          consumerPubKey: item.consumerPubKey,
          meta
        })
        }
      }
      return nfts;
    }
  )

  const _contract = contract;
  const listNft = useCallback(async (tokenId: number, price: string) => {
    try {
      const result = await _contract!.placeNftOnSale(
        tokenId,  
        ethers.utils.parseEther(price),
        {
          value: ethers.utils.parseEther(0.025.toString())
        }
      )

      await toast.promise(
        result!.wait(), {
          pending: "Processing transaction",
          success: "Item has been listed",
          error: "Processing error"
        }
      );

    } catch (e: any) {
      console.error(e.message);
    }
  }, [_contract])

  return {
    ...swr,
    listNft,
    data: data || [],
  };
}
