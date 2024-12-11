import React from 'react'
import NextButton from '@/components/buttons/NextButton'
import ErrorButton from '@/components/buttons/ErrorButton'
import WarningMessage from '@/components/WarningMessage'
import { MINIMUM_RECEIVE_AMOUNT_USD } from '@/utils/constants/constants'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import { formatUsd } from '@/utils/formatting'

interface ReviewOrderButtonProps {
  amountError: string | null
  gasFeeError: string | null
  outAmountUsd: string
  payAmount: string
  loadingQuote: boolean
  payToken: ChaingeToken | null
  receiveToken: ChaingeToken | null
  setIsReviewOrderOpen: () => void
}

const ReviewOrderButton: React.FC<ReviewOrderButtonProps> = ({
  amountError,
  gasFeeError,
  outAmountUsd,
  payAmount,
  loadingQuote,
  payToken,
  receiveToken,
  setIsReviewOrderOpen,
}) => {
  const isBelowMinimum = parseFloat(outAmountUsd.replace(/,/g, '')) < MINIMUM_RECEIVE_AMOUNT_USD

  return (
    <div className="bottom-20 left-0 right-0 px-4 fixed">
      {payToken?.symbol === receiveToken?.symbol && payToken && receiveToken ? (
        <WarningMessage message="Cannot swap the same token to itself" />
      ) : payAmount === '0' ? (
        <WarningMessage message="Pay amount must be more than 0" />
      ) : amountError && Number(payAmount) > 0 ? (
        <ErrorButton text="Insufficient funds" />
      ) : !loadingQuote && isBelowMinimum && Number(payAmount) > 0 ? (
        <WarningMessage
          message={`Receive amount must be more than ${formatUsd(MINIMUM_RECEIVE_AMOUNT_USD)}`}
        />
      ) : gasFeeError ? (
        <WarningMessage message="Either the pay amount is invalid or not enough KAS for gas fees" />
      ) : Number(payAmount) > 0 ? (
        <NextButton text="Review Order" onClick={setIsReviewOrderOpen} buttonEnabled={!loadingQuote} />
      ) : (
        <div />
      )}
    </div>
  )
}

export default ReviewOrderButton
