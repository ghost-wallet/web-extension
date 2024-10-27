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
    <div className="flex justify-center mt-4 relative">
      <div className="px-2">
        <ReceiveButton />
      </div>
      <div className="px-2">
        <ActionButton
          icon={<PaperAirplaneIcon strokeWidth={2} />}
          label="Send"
          onClick={() => navigate(`/send/${token.tick}`, { state: { token } })}
        />
      </div>
      <div className="px-2">
        <SwapButton token={token} />
      </div>
      {token.tick.toUpperCase() !== 'KASPA' && (
        <div className="px-2">
          <MintButton tokenTick={token.tick} />
        </div>
      )}
    </div>
  )
}

export default ActionButtons
