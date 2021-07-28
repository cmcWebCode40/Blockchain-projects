import React from 'react'
import DigitalAssetCard from './DigitalAssetCard'



interface IDigitalAssetList {
  nfts?: any
}

const defaultData = [1, 2, 3, 4, 5, 6, 7]

const DigitalAssetList = ({ nfts = defaultData }: IDigitalAssetList) => {
  return (
    <div className="grid lg:grid-cols-3 gap-4 space-x-4 mx-5 sm:grid-cols-1">
      {nfts.map((list:any) => (
        <DigitalAssetCard key={list} />
      ))}
    </div>
  )
}

export default DigitalAssetList
