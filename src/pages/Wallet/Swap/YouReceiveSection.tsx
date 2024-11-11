import React from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import ValueAndAvailableBalance from '@/pages/Wallet/Swap/ValueAndAvailableBalance'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'

interface YouReceiveSectionProps {
  receiveAmount: string
  receiveToken: ChaingeToken | null
  openTokenSelect: () => void
  tokens: any[]
}

const YouReceiveSection: React.FC<YouReceiveSectionProps> = ({
  receiveAmount,
  receiveToken,
  openTokenSelect,
  tokens,
}) => {
  const { currencySymbol, formattedCurrencyValue, formattedBalance } = useChaingeTokenData(
    receiveAmount,
    receiveToken,
    tokens,
  )

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
      <ValueAndAvailableBalance
        currencySymbol={currencySymbol}
        formattedCurrencyValue={formattedCurrencyValue}
        formattedBalance={formattedBalance}
      />
    </div>
  )
}

export default YouReceiveSection
