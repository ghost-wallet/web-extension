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
import Crypto from '@/pages/Wallet/Crypto'

function App() {
  return (
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
            <Route path="/send" element={<Send />} />
            <Route path="/send/:tick" element={<SendCrypto />} />
            <Route path="/send/:tick/confirm" element={<ConfirmSend />} />
            <Route path="/send/:tick/confirmkrc20" element={<ConfirmSendKRC20 />} />
            <Route path="/send/:tick/confirm/sent" element={<Sent />} />
            <Route path="/receive" element={<Receive />} />
            <Route path="/swap" element={<Swap />} />
          </Routes>
        </MemoryRouter>
      </KaspaProvider>
    </SettingsProvider>
  )
}

export default App
