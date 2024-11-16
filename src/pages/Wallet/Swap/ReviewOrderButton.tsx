import React from 'react'
import NextButton from '@/components/buttons/NextButton'
import ErrorButton from '@/components/buttons/ErrorButton'
import WarningMessage from '@/components/WarningMessage'
import { MINIMUM_RECEIVE_AMOUNT_USD } from '@/utils/constants/constants'

interface ReviewOrderButtonProps {
  amountError: string | null
  networkFeeError: string | null
  outAmountUsd: string
  payAmount: string
  loadingQuote: boolean
  setIsReviewOrderOpen: () => void
}

const ReviewOrderButton: React.FC<ReviewOrderButtonProps> = ({
  amountError,
  networkFeeError,
  outAmountUsd,
  payAmount,
  loadingQuote,
  setIsReviewOrderOpen,
}) => {
  const isBelowMinimum = parseFloat(outAmountUsd) < MINIMUM_RECEIVE_AMOUNT_USD

  return (
    <div className="bottom-20 left-0 right-0 px-4 fixed">
      {payAmount === '0' ? (
        <WarningMessage message="Pay amount must be more than 0" />
      ) : amountError && Number(payAmount) > 0 ? (
        <ErrorButton text="Insufficient Funds" />
      ) : isBelowMinimum && Number(payAmount) > 0 ? (
        <WarningMessage message={`Receive amount must be more than $${MINIMUM_RECEIVE_AMOUNT_USD} USD.`} />
      ) : networkFeeError ? (
        <WarningMessage message="Error calculating network fee" />
      ) : Number(payAmount) > 0 ? (
        <NextButton text="Review Order" onClick={setIsReviewOrderOpen} buttonEnabled={!loadingQuote} />
      ) : (
        <div />
      )}
    </div>
  )
}

export default ReviewOrderButton
