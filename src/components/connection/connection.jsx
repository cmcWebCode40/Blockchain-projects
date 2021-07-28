import React from 'react'
import { useWallet, UseWalletProvider } from 'use-wallet'

function WalletApp() {
  const wallet = useWallet()


  return (
    <>

      <button onClick={() => wallet.connect()}>MetaMask</button>

    </>
  )
}

// Wrap everything in <UseWalletProvider />
// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <UseWalletProvider
    chainId={3}
    connectors={{
      // This is how connectors get configured
      // portis: { dWalletAppId: 'my-dWalletApp-id-123-xyz' },
      provided: { provider: window.cleanEthereum }
    }}
  >
    <WalletApp />
  </UseWalletProvider>
)