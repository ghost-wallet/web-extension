import { ArrowUpIcon, ArrowDownIcon, ArrowsRightLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ActionButton from '@/components/buttons/ActionButtons/ActionButton'
import { useContext } from 'react'
import { KasplexContext } from '@/contexts/kasplex/KasplexContext'

export default function ActionButtons() {
  const navigate = useNavigate()
  const kasplexContext = useContext(KasplexContext)

  if (!kasplexContext) {
    throw new Error('KasplexContext is not available')
  }

  const { loadTokens } = kasplexContext

  // TODO refresh Kaspa via account:scan too?
  const handleRefresh = async () => {
    try {
      await loadTokens(true)
    } catch (error) {
      console.error('Error refreshing KRC20 tokens:', error)
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

      <ActionButton icon={<ArrowPathIcon strokeWidth={2} />} label="Refresh" onClick={handleRefresh} />
    </div>
  )
}
