import React from 'react'
import NextButton from '@/components/buttons/NextButton'
import ErrorButton from '@/components/buttons/ErrorButton'
import WarningMessage from '@/components/WarningMessage'

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
  const isBelowMinimum = parseFloat(outAmountUsd) < 1.0

  return (
    <div className="bottom-20 left-0 right-0 px-4 fixed">
      {payAmount === '0' ? (
        <WarningMessage message="Pay amount must be more than 0" />
      ) : amountError && Number(payAmount) > 0 ? (
        <ErrorButton text="Insufficient Funds" />
      ) : isBelowMinimum && Number(payAmount) > 0 ? (
        <WarningMessage message="You must receive at least $1 USD to submit a swap order." />
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
