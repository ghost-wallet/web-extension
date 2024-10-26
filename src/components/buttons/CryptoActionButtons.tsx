import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'
import MintButtonOnCryptoPage from '@/components/buttons/MintButtonOnCryptoPage'
import SwapButtonOnCryptoPage from '@/components/buttons/SwapButtonOnCryptoPage'
import ReceiveButton from '@/components/buttons/ReceiveButton'

interface CryptoActionButtonsProps {
  token: {
    tick: string
  }
}

const CryptoActionButtons: React.FC<CryptoActionButtonsProps> = ({ token }) => {
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
        <SwapButtonOnCryptoPage token={token} />
      </div>
      {token.tick.toUpperCase() !== 'KASPA' && (
        <div className="px-2">
          <MintButtonOnCryptoPage tokenTick={token.tick} />
        </div>
      )}
    </div>
  )
}

export default CryptoActionButtons
