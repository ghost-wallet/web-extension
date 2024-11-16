import React from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import useReceiveAmountAfterFees from '@/hooks/chainge/useReceiveAmountAfterFees'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface YouReceiveSectionProps {
  receiveAmount: string
  receiveToken: ChaingeToken | null
  payAmount: string
  openTokenSelect: () => void
  tokens: any[]
  aggregateQuote: ChaingeAggregateQuote | undefined
  loadingQuote: boolean
}

const YouReceiveSection: React.FC<YouReceiveSectionProps> = ({
  receiveAmount,
  receiveToken,
  payAmount,
  openTokenSelect,
  tokens,
  aggregateQuote,
  loadingQuote,
}) => {
  const receiveAmountAfterFees = useReceiveAmountAfterFees(aggregateQuote, receiveToken)
  const { currencySymbol } = useChaingeTokenData(receiveAmount, receiveToken, tokens)
  const displayAmount = receiveAmount ? formatNumberAbbreviated(receiveAmountAfterFees) : ''

  return (
    <div className="bg-darkmuted rounded-lg p-4">
      <h2 className="text-lightmuted text-base mb-2">You Receive</h2>
      <div className="flex items-center justify-between">
        {loadingQuote || (payAmount && !receiveAmount && !aggregateQuote?.outAmountUsd) ? (
          <div className="w-40 h-8 bg-muted rounded-md animate-pulse"></div>
        ) : (
          <input
            type="text"
            value={displayAmount}
            placeholder="0"
            readOnly
            className={`bg-transparent ${
              displayAmount ? 'text-primarytext' : 'text-lightmuted'
            } placeholder:text-lightmuted text-2xl w-40 focus:outline-none`}
          />
        )}
        <ChaingeTokenDropdown selectedToken={receiveToken} openTokenSelect={openTokenSelect} />
      </div>

      {loadingQuote || (payAmount && !receiveAmount && !aggregateQuote?.outAmountUsd) ? (
        <div className="w-14 h-5 bg-muted rounded-md mb-1 animate-pulse"></div>
      ) : (
        aggregateQuote &&
        receiveAmount && (
          <EstimatedCurrencyValue
            currencySymbol={currencySymbol}
            formattedCurrencyValue={Number(aggregateQuote.outAmountUsd).toFixed(2)}
          />
        )
      )}
    </div>
  )
}

export default YouReceiveSection
