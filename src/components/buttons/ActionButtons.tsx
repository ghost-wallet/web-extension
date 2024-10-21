import { useState } from 'react'
import { ArrowUpIcon, ArrowDownIcon, ArrowsRightLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ActionButton from '@/components/buttons/ActionButtons/ActionButton'
import useKasplex from '@/hooks/useKasplex'

export default function ActionButtons() {
  const navigate = useNavigate()
  const { loadTokens } = useKasplex() // No need for refresh prop
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadTokens() // No refresh parameter is needed
    } catch (error) {
      console.error('Error refreshing KRC20 tokens:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="my-4 flex justify-between gap-4">
      <ActionButton icon={<ArrowUpIcon strokeWidth={2} />} label="Send" onClick={() => navigate('/send')} />
      <ActionButton
        icon={<ArrowDownIcon strokeWidth={2} />}
        label="Receive"
        onClick={() => navigate('/receive')}
      />
      <ActionButton
        icon={<ArrowsRightLeftIcon strokeWidth={2} />}
        label="Swap"
        onClick={() => navigate('/swap')}
      />

      <ActionButton
        icon={<ArrowPathIcon strokeWidth={2} className={isRefreshing ? 'animate-spin' : ''} />}
        label="Refresh"
        onClick={handleRefresh}
        disabled={isRefreshing}
      />
    </div>
  )
}
