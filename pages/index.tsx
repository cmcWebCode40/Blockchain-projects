import Head from 'next/head'
import Image from 'next/image'
import { DigitalAssetCard } from '../components'
import HeroeSection from './home/components/HeroeSection'
import Features from './home/components/Features'
import GettingStarted from './home/components/GettingStarted'
import DigitalAssetList from '../components/digitalAssetCard/DigitalAssetList'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dig Art</title>
        <meta name="description" content="NFT Market Place" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeroeSection />
     <DigitalAssetList/>
      <Features />
      <GettingStarted />
    </div>
  )
}
