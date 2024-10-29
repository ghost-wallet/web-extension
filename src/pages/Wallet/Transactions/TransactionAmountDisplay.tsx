import React from 'react'
import { formatNumberWithAbbreviation } from '@/utils/formatting'

interface TransactionAmountDisplayProps {
  amt: string
  tick: string
  isMint: boolean
  isReceived: boolean
}

const TransactionAmountDisplay: React.FC<TransactionAmountDisplayProps> = ({
  amt,
  tick,
  isMint,
  isReceived,
}) => {
  const formattedAmount = isNaN(parseInt(amt, 10))
    ? '0'
    : formatNumberWithAbbreviation(parseInt(amt, 10) / 1e8)

  const amountDisplay = `${isMint || isReceived ? '+' : '-'}${formattedAmount} ${tick}`
  const amountColor = isMint || isReceived ? 'text-success' : 'text-error'

  return <p className={`text-base font-lato ${amountColor}`}>{amountDisplay}</p>
}

export default TransactionAmountDisplay
