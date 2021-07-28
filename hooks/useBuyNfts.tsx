import React from 'react';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import { tradingAddress, digArtAddress } from '../utils/contractAddress';
import Trading from '../artifacts/contracts/TradingNFT.sol/TradingNFT.json';


type TNftItem = {
  price:string;
  tokenId:string;
}

const useBuyNfts = () => {

  const buyNft =async (nftItem:TNftItem) => {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(tradingAddress, Trading.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nftItem.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(digArtAddress, nftItem.tokenId, {
      value: price
    })
    await transaction.wait();
  }
  return {
    buyNft
  }
}

export default useBuyNfts
