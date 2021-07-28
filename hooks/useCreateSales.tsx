import React from 'react'
import { ethers } from 'ethers';
import { tradingAddress, digArtAddress } from '../utils/contractAddress'
import NFT from '../artifacts/contracts/DigArt.sol/DigArtNFt.json'
import Trading from '../artifacts/contracts/TradingNFT.sol/TradingNFT.json'

interface IUseCreateSales {
  url:string;
}

const useCreateSales = ({url}:IUseCreateSales) => {

  const createSale =async()=>{
    //  const web3Modal = new Web3Modal()
    const connection = 'await web3Modal.connect()'
    const provider = new ethers.providers.Web3Provider(connection as any)    
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(digArtAddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits('2', 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(tradingAddress, Trading.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(digArtAddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
  }
  return {
    createSale
  }
}

export default useCreateSales
