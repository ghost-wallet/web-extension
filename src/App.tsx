import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './contexts/Settings'
import { KaspaProvider } from './contexts/Kaspa'
import Landing from './pages/Landing'
import CreateWallet from '@/pages/CreateWallet'
import Wallet from '@/pages/Wallet'
import UnlockWallet from '@/pages/Unlock'
import Settings from '@/pages/Wallet/Settings'
import Transactions from '@/pages/Wallet/Transactions'
import Send from '@/pages/Wallet/Send'
import Receive from '@/pages/Wallet/Receive'
import Swap from '@/pages/Wallet/Swap'

function App() {
  return (
    <SettingsProvider>
      <KaspaProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreateWallet />} />
            <Route path="/unlock" element={<UnlockWallet />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/send" element={<Send />} />
            <Route path="/receive" element={<Receive />} />
            <Route path="/swap" element={<Swap />} />
          </Routes>
        </MemoryRouter>
      </KaspaProvider>
    </SettingsProvider>
  )
}

export default App
