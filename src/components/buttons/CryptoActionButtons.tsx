import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaperAirplaneIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import WalletActionButton from '@/components/buttons/WalletActionButtons/WalletActionButton'

interface CryptoActionButtonsProps {
  token: {
    tick: string
  }
}

const CryptoActionButtons: React.FC<CryptoActionButtonsProps> = ({ token }) => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center space-x-6 mt-4">
      <WalletActionButton
        icon={<ArrowDownIcon strokeWidth={2} />}
        label="Receive"
        onClick={() => navigate('/receive')}
      />
      <WalletActionButton
        icon={<PaperAirplaneIcon strokeWidth={2} />}
        label="Send"
        onClick={() => navigate(`/send/${token.tick}`, { state: { token } })}
      />
    </div>
  )
}

export default CryptoActionButtons
