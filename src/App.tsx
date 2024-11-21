import { HashRouter as Router, Route, Routes } from 'react-router-dom'
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
import InitiateSend from '@/pages/Wallet/Send/InitiateSend'
import ConfirmSendKaspa from '@/pages/Wallet/Send/ConfirmSendKaspa'
import ConfirmSendKRC20 from '@/pages/Wallet/Send/ConfirmSendKRC20'
import Sent from '@/pages/Wallet/Send/Sent'
import ConfirmReset from '@/pages/Wallet/Settings/Reset/ConfirmReset'
import ForgotPassword from '@/pages/Login/ForgotPassword'
import Crypto from '@/pages/Wallet/CryptoList/Crypto'
import Mint from '@/pages/Wallet/Mint'
import CreateMint from '@/pages/Wallet/Mint/CreateMint'
import ConfirmMint from '@/pages/Wallet/Mint/ConfirmMint'
import Minted from '@/pages/Wallet/Mint/Minted'
import KRC20TxnDetails from '@/pages/Wallet/Transactions/KRC20TxnDetails'
import AboutPage from '@/pages/Wallet/Settings/About/AboutPage'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import NetworkFeeSelect from '@/pages/Wallet/Send/NetworkFeeSelect'
import DeveloperPage from '@/pages/Wallet/Settings/Developer/DeveloperPage'
import KaspaTxnDetails from '@/pages/Wallet/Transactions/KaspaTxnDetails'
import ManageTokens from '@/pages/Wallet/CryptoList/ManageTokens'
import ManageAccounts from '@/pages/Wallet/Settings/Account/ManageAccounts'
import Swapped from '@/pages/Wallet/Swap/Swapped'
import SupportPage from '@/pages/Wallet/Settings/Support/SupportPage'
import SearchWalletResults from '@/components/search/SearchWalletResults'
import Marketplace from '@/pages/Wallet/Marketplace'
import SellTokenList from '@/pages/Wallet/Marketplace/SellTokenList'
import CreateListing from '@/pages/Wallet/Marketplace/CreateListing'

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
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/create" element={<CreateWallet />} />
              <Route path="/unlock" element={<Login />} />
              <Route path="/unlock/forgotpassword" element={<ForgotPassword />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/wallet/:tick" element={<Crypto />} />
              <Route path="/wallet/search" element={<SearchWalletResults />} />
              <Route path="/wallet/manage" element={<ManageTokens />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/reset" element={<ConfirmReset />} />
              <Route path="/settings/about" element={<AboutPage />} />
              <Route path="/settings/support" element={<SupportPage />} />
              <Route path="/settings/developer" element={<DeveloperPage />} />
              <Route path="/settings/accounts" element={<ManageAccounts />} />
              <Route path="/transactions/kaspa" element={<Transactions />} />
              <Route path="/transactions/kaspa/details" element={<KaspaTxnDetails />} />
              <Route path="/transactions/krc20" element={<Transactions />} />
              <Route path="/transactions/krc20/details" element={<KRC20TxnDetails />} />
              <Route path="/send" element={<Send />} />
              <Route path="/send/:tick" element={<InitiateSend />} />
              <Route path="/send/:tick/network-fee" element={<NetworkFeeSelect />} />
              <Route path="/send/:tick/network-fee/confirm" element={<ConfirmSendKaspa />} />
              <Route path="/send/:tick/network-fee/confirmkrc20" element={<ConfirmSendKRC20 />} />
              <Route path="/send/:tick/sent" element={<Sent />} />
              <Route path="/receive" element={<Receive />} />
              <Route path="/swap" element={<Swap />} />
              <Route path="/swap/confirmed" element={<Swapped />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/sell" element={<SellTokenList />} />
              <Route path="/marketplace/sell/:tick" element={<CreateListing />} />
              <Route path="/mint" element={<Mint />} />
              <Route path="/mint/:tick" element={<CreateMint />} />
              <Route path="/mint/:tick/review" element={<ConfirmMint />} />
              <Route path="/mint/:tick/review/minted" element={<Minted />} />
            </Routes>
          </Router>
        </KaspaProvider>
      </SettingsProvider>
    </PersistQueryClientProvider>
  )
}

export default App
