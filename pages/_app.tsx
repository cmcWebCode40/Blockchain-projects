import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Footer, Header } from '../components'
import AuthProvider from '../context/AuthProvider'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <AuthProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  )
}

export default MyApp

