import { ArrowDownIcon, PaperAirplaneIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ActionButton from '@/components/buttons/ActionButton'

export default function WalletActionButtons() {
  const navigate = useNavigate()

  return (
    <div className="my-4 flex justify-between gap-4">
      <ActionButton
        icon={<ArrowDownIcon strokeWidth={2} />}
        label="Receive"
        onClick={() => navigate('/receive')}
      />
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
    </div>
  )
}
