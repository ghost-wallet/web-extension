import { PaperAirplaneIcon, ArrowsRightLeftIcon, BoltIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ActionButton from '@/components/buttons/ActionButton'
import ReceiveButton from '@/components/buttons/ReceiveButton'

export default function WalletActionButtons() {
  const navigate = useNavigate()

  return (
    <div className="my-4 flex justify-between gap-4">
      <ReceiveButton />
      <ActionButton
        icon={<PaperAirplaneIcon strokeWidth={2} />}
        label="Send"
        onClick={() => navigate('/send')}
      />
      <ActionButton
        icon={<ArrowsRightLeftIcon strokeWidth={2} />}
        label="Swap"
        onClick={() => navigate('/swap')}
      />
      <ActionButton icon={<BoltIcon strokeWidth={2} />} label="Mint" onClick={() => navigate('/mint')} />
    </div>
  )
}
