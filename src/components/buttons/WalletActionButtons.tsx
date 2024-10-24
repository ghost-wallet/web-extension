import { ArrowDownIcon, PaperAirplaneIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import WalletActionButton from '@/components/buttons/WalletActionButtons/WalletActionButton'

export default function WalletActionButtons() {
  const navigate = useNavigate()

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
    </div>
  )
}
