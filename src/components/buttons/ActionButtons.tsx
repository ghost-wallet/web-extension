import { ArrowUpIcon, ArrowDownIcon, ArrowsRightLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ActionButton from '@/components/buttons/ActionButtons/ActionButton'

interface ActionButtonsProps {
  onRefresh: () => void
}

export default function ActionButtons({ onRefresh }: ActionButtonsProps) {
  const navigate = useNavigate()

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

      <ActionButton icon={<ArrowPathIcon strokeWidth={2} />} label="Refresh" onClick={onRefresh} />
    </div>
  )
}
