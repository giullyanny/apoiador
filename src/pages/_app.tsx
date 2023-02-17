import type { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { Provider as NextAuthProvider } from 'next-auth/client'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import '../style/global.scss'

const initialOptions = {
  "client-id": "AYN7TWpomNsrWmP_f0Yw5cJtaK5wXPGzVVSxGoSpRfb0kFTuyQ89d3WkUADm2zbOyqSb4kmV_075PF0S",
  currency: "BRL",
  intent: "capture",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NextAuthProvider session={pageProps.session}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </NextAuthProvider>
    </>
  )
}
