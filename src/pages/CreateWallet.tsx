import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Landing from '@/pages/CreateWallet/Landing'
import Create from '@/pages/CreateWallet/Create'
import Password from '@/pages/CreateWallet/Password'
import Import from '@/pages/CreateWallet/Import'
import Confirm from '@/pages/CreateWallet/Confirm'
import useKaspa from '@/hooks/contexts/useKaspa'
import AnimatedMain from '@/components/AnimatedMain'
import SpinnerPage from '@/components/SpinnerPage'

export enum Tabs {
  Landing,
  Password,
  Create,
  Import,
  Confirm,
}

export default function CreateWallet() {
  const navigate = useNavigate()
  const { request } = useKaspa()

  const [tab, setTab] = useState(Tabs.Landing)
  const [password, setPassword] = useState('')
  const [mnemonic, setMnemonic] = useState('')
  const [flowType, setFlowType] = useState<'create' | 'import'>('create')
  const [loading, setLoading] = useState(false)

  const handleForward = (nextTab: Tabs, nextFlowType?: 'create' | 'import') => {
    if (nextFlowType) setFlowType(nextFlowType)
    setTab(nextTab)
  }

  const handlePasswordSet = async (_password: string) => {
    setPassword(_password)
    if (flowType === 'create') {
      const mnemonic = await request('wallet:createMnemonic', [])
      setMnemonic(mnemonic)
      setTab(Tabs.Create)
    } else {
      setTab(Tabs.Import)
    }
  }

  const handleMnemonicSubmit = async (mnemonic: string) => {
    try {
      setLoading(true)
      await request('wallet:import', [mnemonic, password])
      navigate('/wallet')
    } catch (error) {
      console.error('Error setting up wallet:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    setTab(Tabs.Confirm)
  }

  return (
    <AnimatedMain>
      {loading ? (
        <SpinnerPage displayText="Initializing wallet..." />
      ) : (
        {
          [Tabs.Landing]: <Landing forward={handleForward} />,
          [Tabs.Password]: <Password onPasswordSet={handlePasswordSet} />,
          [Tabs.Import]: <Import onMnemonicsSubmit={handleMnemonicSubmit} />,
          [Tabs.Create]: <Create mnemonic={mnemonic} onSaved={handleConfirm} />,
          [Tabs.Confirm]: (
            <Confirm
              mnemonic={mnemonic}
              onConfirmed={async () => {
                await handleMnemonicSubmit(mnemonic)
              }}
            />
          ),
        }[tab]
      )}
    </AnimatedMain>
  )
}
