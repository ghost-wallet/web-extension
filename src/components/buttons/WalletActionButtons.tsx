import { PaperAirplaneIcon, ArrowsRightLeftIcon, BoltIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ActionButton from '@/components/buttons/ActionButton'
import ReceiveButton from '@/components/buttons/ReceiveButton'

export default function WalletActionButtons() {
  const navigate = useNavigate()

  return (
    <div className="flex gap-3 w-full p-4">
      <ReceiveButton className="flex-1" />
      <ActionButton
        icon={<PaperAirplaneIcon strokeWidth={2} />}
        label="Send"
        onClick={() => navigate('/send')}
        className="flex-1"
      />
      <ActionButton
        icon={<ArrowsRightLeftIcon strokeWidth={2} />}
        label="Swap"
        onClick={() => navigate('/swap')}
        className="flex-1"
      />
      <ActionButton
        icon={<BoltIcon strokeWidth={2} />}
        label="Mint"
        onClick={() => navigate('/mint')}
        className="flex-1"
      />
    </div>
  )
}
