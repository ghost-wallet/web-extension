import React from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'

interface YouReceiveSectionProps {
  receiveAmount: string
  receiveToken: ChaingeToken | null
  payAmount: string
  openTokenSelect: () => void
  tokens: any[]
  outAmountUsd: string
  loadingQuote: boolean
}

const YouReceiveSection: React.FC<YouReceiveSectionProps> = ({
  receiveAmount,
  receiveToken,
  payAmount,
  openTokenSelect,
  tokens,
  outAmountUsd,
  loadingQuote,
}) => {
  const { currencySymbol } = useChaingeTokenData(receiveAmount, receiveToken, tokens)

  return (
    <div className="bg-darkmuted rounded-lg p-4">
      <h2 className="text-lightmuted text-base mb-2">You Receive</h2>
      <div className="flex items-center justify-between">
        {loadingQuote || (payAmount && !receiveAmount && !outAmountUsd) ? (
          <div className="w-40 h-8 bg-muted rounded-md animate-pulse"></div>
        ) : (
          <input
            type="text"
            value={receiveAmount}
            placeholder="0"
            readOnly
            className="bg-transparent text-primarytext placeholder-lightmuted text-2xl w-40 focus:outline-none"
          />
        )}
        <ChaingeTokenDropdown selectedToken={receiveToken} openTokenSelect={openTokenSelect} />
      </div>
      {loadingQuote || (payAmount && !receiveAmount && !outAmountUsd) ? (
        <div className="w-14 h-5 bg-muted rounded-md mt-2 animate-pulse"></div>
      ) : (
        <EstimatedCurrencyValue currencySymbol={currencySymbol} formattedCurrencyValue={outAmountUsd} />
      )}
    </div>
  )
}

export default YouReceiveSection
