import React from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'

interface YouReceiveSectionProps {
  receiveAmount: string
  receiveToken: ChaingeToken | null
  openTokenSelect: () => void
}

const YouReceiveSection: React.FC<YouReceiveSectionProps> = ({
  receiveAmount,
  receiveToken,
  openTokenSelect,
}) => {
  return (
    <div className="bg-darkmuted rounded-lg p-4">
      <h2 className="text-lightmuted text-base mb-2">You Receive</h2>
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={receiveAmount}
          placeholder="0"
          readOnly
          className="bg-transparent text-primarytext placeholder-lightmuted text-2xl w-40 focus:outline-none"
        />
        <ChaingeTokenDropdown selectedToken={receiveToken} openTokenSelect={openTokenSelect} />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-mutedtext">$0.00</span>
      </div>
    </div>
  )
}

export default YouReceiveSection
