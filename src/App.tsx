import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './contexts/Settings'
import { KaspaProvider } from './contexts/KaspaContextProvider'
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

function App() {
  return (
    <SettingsProvider>
      <KaspaProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateWallet />} />
            <Route path="/unlock" element={<Login />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/reset" element={<ConfirmReset />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/send" element={<Send />} />
            <Route path="/send/crypto" element={<SendCrypto />} />
            <Route path="/send/crypto/confirm" element={<ConfirmSend />} />
            <Route path="/send/crypto/confirmkrc20" element={<ConfirmSendKRC20 />} />
            <Route path="/send/crypto/confirm/sent" element={<Sent />} />
            <Route path="/receive" element={<Receive />} />
            <Route path="/swap" element={<Swap />} />
          </Routes>
        </MemoryRouter>
      </KaspaProvider>
    </SettingsProvider>
  )
}

export default App
