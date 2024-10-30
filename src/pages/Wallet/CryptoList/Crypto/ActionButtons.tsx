import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'
import MintButton from '@/pages/Wallet/CryptoList/Crypto/MintButton'
import SwapButton from '@/pages/Wallet/CryptoList/Crypto/SwapButton'
import ReceiveButton from '@/components/buttons/ReceiveButton'
import { Token } from '@/utils/interfaces'

interface CryptoActionButtonsProps {
  token: Token
}

const ActionButtons: React.FC<CryptoActionButtonsProps> = ({ token }) => {
  const navigate = useNavigate()

  return (
    <div className="flex gap-3 w-full p-4">
      <ReceiveButton className="flex-1" />
      <ActionButton
        className="flex-1"
        icon={<PaperAirplaneIcon strokeWidth={2} />}
        label="Send"
        onClick={() => navigate(`/send/${token.tick}`, { state: { token } })}
      />
      <SwapButton token={token} className="flex-1" />
      {token.tick.toUpperCase() !== 'KASPA' && <MintButton tokenTick={token.tick} className="flex-1" />}
    </div>
  )
}

export default ActionButtons
