import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { tradingAddress, digArtAddress } from '../utils/contractAddress'
import axios from 'axios';
import NFT from '../artifacts/contracts/DigArt.sol/DigArtNFt.json'
import Trading from '../artifacts/contracts/TradingNFT.sol/TradingNFT.json'


type TFunctionName = 'getTradingItems' | 'getCreatedItems' | 'getUserNFT';

interface IUseLoadNfts {
  funcExecName: TFunctionName;
  isCreatedItems?: boolean;
}

const useLoadNfts = ({ funcExecName, isCreatedItems }: IUseLoadNfts) => {
  const [nfts, setNfts] = useState<any>([]);
  const [sold, setSold] = useState<any>([])
  const [loadingState, setLoadingState] = useState(true)



  useEffect(() => {
    const loadNft = async () => {
      /* create a generic provider and query for unsold market items */
      const provider = new ethers.providers.JsonRpcProvider()
      const tokenContract = new ethers.Contract(digArtAddress, NFT.abi, provider)
      const marketContract = new ethers.Contract(tradingAddress, Trading.abi, provider)
      const data = await marketContract[funcExecName]()
      /*
      *  map over items returned from smart contract and format 
      *  them as well as fetch their token metadata
      */
      const items = await Promise.all(data.map(async (i: any) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        }
        return item
      }))
      if (isCreatedItems) {
        const soldItems = items.filter((i: any) => i.sold)
        setSold(soldItems)
      }
      setNfts(items)
      setLoadingState(!loadingState)
    }

    loadNft()
  }, [funcExecName, isCreatedItems, loadingState])

  return {
    digitalAssets: nfts,
    loadingState,
    sold
  }
}

export default useLoadNfts
