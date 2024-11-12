import React from 'react'
import NextButton from '@/components/buttons/NextButton'
import ErrorButton from '@/components/buttons/ErrorButton'

interface ReviewOrderButtonProps {
  amountError: string | null
  outAmountUsd: string
  payAmount: string
  loadingQuote: boolean
  setIsReviewOrderOpen: () => void
}

const ReviewOrderButton: React.FC<ReviewOrderButtonProps> = ({
  amountError,
  outAmountUsd,
  payAmount,
  loadingQuote,
  setIsReviewOrderOpen,
}) => {
  const isBelowMinimum = parseFloat(outAmountUsd) < 1.0

  return (
    <div className="bottom-20 left-0 right-0 px-4 fixed">
      {amountError && Number(payAmount) > 0 ? (
        <ErrorButton text="Insufficient Funds" />
      ) : isBelowMinimum && Number(payAmount) > 0 ? (
        <ErrorButton text="Swap Minimum is $1" />
      ) : Number(payAmount) > 0 ? (
        <NextButton text="Review Order" onClick={setIsReviewOrderOpen} buttonEnabled={!loadingQuote} />
      ) : (
        <div />
      )}
    </div>
  )
}

export default ReviewOrderButton
