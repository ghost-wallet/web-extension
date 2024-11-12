import React from 'react'
import ModalContainer from '@/components/ModalContainer'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import ReviewOrderToken from '@/pages/Wallet/Swap/ReviewOrderToken'
import NextButton from '@/components/buttons/NextButton'
import { ChaingeAggregateQuote } from '@/hooks/chainge/fetchAggregateQuote'
import { formatNumberAbbreviated } from '@/utils/formatting'
import ReviewOrderQuote from '@/pages/Wallet/Swap/ReviewOrderQuote'
import useReceiveAmountAfterFees from '@/hooks/chainge/useReceiveAmountAfterFees'
import useKaspa from '@/hooks/contexts/useKaspa'

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
  const receiveAmountAfterFees = useReceiveAmountAfterFees(aggregateQuote, receiveToken)
  const { currencySymbol, formattedCurrencyValue } = useChaingeTokenData(payAmount, payToken, [])
  const { request } = useKaspa()

  return (
    <ModalContainer title="Review Order" onClose={onClose}>
      <div className="flex-grow overflow-y-auto space-y-2">
        {/* You Pay Section */}
        <ReviewOrderToken
          title="You Pay"
          token={payToken}
          amount={formatNumberAbbreviated(Number(payAmount))}
          estimatedValue={formattedCurrencyValue}
          currencySymbol={currencySymbol}
        />

        {/* You Receive Section */}
        <ReviewOrderToken
          title="You Receive"
          token={receiveToken}
          amount={formatNumberAbbreviated(receiveAmountAfterFees)}
          estimatedValue={aggregateQuote.outAmountUsd}
          currencySymbol={currencySymbol}
        />

        <ReviewOrderQuote aggregateQuote={aggregateQuote} receiveToken={receiveToken} />
      </div>
      <div className="pt-4">
        <NextButton text="Swap" onClick={() => {
          request('account:submitChaingeOrder', [{
            fromAmount: payAmount,
            fromToken: payToken,
            toToken: receiveToken,
            quote: aggregateQuote,
            feeRate: 1 // TODO use real feeRate
          }])
        }} />
      </div>
    </ModalContainer>
  )
}

export default ReviewOrder
