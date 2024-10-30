import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { KaspaProvider } from './contexts/kaspa/KaspaProvider'
import { SettingsProvider } from '@/contexts/settings/SettingsProvider'
import Landing from './pages/Landing'
import CreateWallet from '@/pages/CreateWallet'
import Wallet from '@/pages/Wallet'
import Login from '@/pages/Login'
import Settings from '@/pages/Wallet/Settings'
import Transactions from '@/pages/Wallet/Transactions'
import Send from '@/pages/Wallet/Send'
import Receive from '@/pages/Wallet/Receive'
import Swap from '@/pages/Wallet/Swap'
import SendCrypto from '@/pages/Wallet/Send/SendCrypto'
import ConfirmSend from '@/pages/Wallet/Send/ConfirmSend'
import ConfirmSendKRC20 from '@/pages/Wallet/Send/ConfirmSendKRC20'
import Sent from '@/pages/Wallet/Send/Sent'
import ConfirmReset from '@/pages/Wallet/Settings/Reset/ConfirmReset'
import ForgotPassword from '@/pages/Login/ForgotPassword'
import Crypto from '@/pages/Wallet/CryptoList/Crypto'
import Mint from '@/pages/Wallet/Mint'
import CreateMint from '@/pages/Wallet/Mint/CreateMint'
import MintNetworkFee from '@/pages/Wallet/Mint/MintNetworkFee'
import ConfirmMint from '@/pages/Wallet/Mint/ConfirmMint'
import Minted from '@/pages/Wallet/Mint/Minted'
import TransactionDetails from '@/pages/Wallet/Transactions/TransactionDetails'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <SettingsProvider>
        <KaspaProvider>
          <MemoryRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/create" element={<CreateWallet />} />
              <Route path="/unlock" element={<Login />} />
              <Route path="/unlock/forgotpassword" element={<ForgotPassword />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/wallet/:tick" element={<Crypto />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/reset" element={<ConfirmReset />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/txn-item" element={<TransactionDetails />} />
              <Route path="/send" element={<Send />} />
              <Route path="/send/:tick" element={<SendCrypto />} />
              <Route path="/send/:tick/confirm" element={<ConfirmSend />} />
              <Route path="/send/:tick/confirmkrc20" element={<ConfirmSendKRC20 />} />
              <Route path="/send/:tick/confirm/sent" element={<Sent />} />
              <Route path="/receive" element={<Receive />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/mint/:tick" element={<CreateMint />} />
              <Route path="/mint/:tick/network-fee" element={<MintNetworkFee />} />
              <Route path="/mint/:tick/network-fee/review" element={<ConfirmMint />} />
              <Route path="/mint/:tick/network-fee/review/minted" element={<Minted />} />
            </Routes>
          </MemoryRouter>
        </KaspaProvider>
      </SettingsProvider>
    </PersistQueryClientProvider>
  )
}

export default App
