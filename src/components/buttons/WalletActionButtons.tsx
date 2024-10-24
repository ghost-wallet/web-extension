import { useState } from 'react'
import {
  ArrowDownIcon,
  PaperAirplaneIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import WalletActionButton from '@/components/buttons/WalletActionButtons/WalletActionButton'
import useKasplex from '@/hooks/contexts/useKasplex'

export default function WalletActionButtons() {
  const navigate = useNavigate()
  const { loadKrc20Tokens } = useKasplex()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadKrc20Tokens(true) // Pass refresh as true to force refresh tokens
    } catch (error) {
      console.error('Error refreshing KRC20 tokens:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="my-4 flex justify-between gap-4">
      <WalletActionButton
        icon={<ArrowDownIcon strokeWidth={2} />}
        label="Receive"
        onClick={() => navigate('/receive')}
      />
      <WalletActionButton
        icon={<PaperAirplaneIcon strokeWidth={2} />}
        label="Send"
        onClick={() => navigate('/send')}
      />
      <WalletActionButton
        icon={<ArrowsRightLeftIcon strokeWidth={2} />}
        label="Swap"
        onClick={() => navigate('/swap')}
      />

      <WalletActionButton
        icon={<ArrowPathIcon strokeWidth={2} className={isRefreshing ? 'animate-spin' : ''} />}
        label="Refresh"
        onClick={handleRefresh}
        disabled={isRefreshing}
      />
    </div>
  )
}
