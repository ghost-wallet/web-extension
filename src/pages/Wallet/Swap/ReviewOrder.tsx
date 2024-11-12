import React from 'react'
import ModalContainer from '@/components/ModalContainer'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import ReviewOrderToken from '@/pages/Wallet/Swap/ReviewOrderToken'
import NextButton from '@/components/buttons/NextButton'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatNumberWithDecimal } from '@/utils/formatting'
import TableSection from '@/components/table/TableSection'

interface ReviewOrderProps {
  payToken: ChaingeToken
  receiveToken: ChaingeToken
  payAmount: string
  aggregateQuote: ChaingeAggregateQuote
  onClose: () => void
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({
  payToken,
  receiveToken,
  payAmount,
  aggregateQuote,
  onClose,
}) => {
  const { currencySymbol, formattedCurrencyValue } = useChaingeTokenData(payAmount, payToken, [])

  return (
    <ModalContainer title="Review Order" onClose={onClose}>
      <div className="flex-grow overflow-y-auto space-y-2">
        {/* You Pay Section */}
        <ReviewOrderToken
          title="You Pay"
          token={payToken}
          amount={payAmount}
          estimatedValue={formattedCurrencyValue}
          currencySymbol={currencySymbol}
        />

        {/* You Receive Section */}
        <ReviewOrderToken
          title="You Receive"
          token={receiveToken}
          amount={formatNumberWithDecimal(aggregateQuote.outAmount, aggregateQuote.chainDecimal).toString()}
          estimatedValue={aggregateQuote.outAmountUsd}
          currencySymbol={currencySymbol}
        />

        <TableSection
          rows={[
            {
              label: 'Aggregator',
              value: aggregateQuote.aggregator,
            },
            {
              label: 'Gas fee',
              value: `${formatNumberWithDecimal(aggregateQuote.gasFee, aggregateQuote.chainDecimal)} KAS`,
            },
            {
              label: 'Service fee',
              value: `${formatNumberWithDecimal(aggregateQuote.serviceFee, aggregateQuote.chainDecimal)} KAS`,
            },
            {
              label: 'Price impact',
              value: `${aggregateQuote.priceImpact} %`,
            },
            {
              label: 'Slippage',
              value: `${aggregateQuote.slippage} %`,
            },
          ]}
        />
      </div>
      <div className="pt-4">
        <NextButton text="Swap" onClick={() => {}} />
      </div>
    </ModalContainer>
  )
}

export default ReviewOrder
