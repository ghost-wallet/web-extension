import React from 'react'
import { formatNumberAbbreviated } from '@/utils/formatting'
import { KAS_TICKER } from '@/utils/constants/tickers'

interface TransactionAmountDisplayProps {
  amt: string
  tick: string
  isMint: boolean
  isReceived: boolean
  className?: string
}

const TransactionAmountDisplay: React.FC<TransactionAmountDisplayProps> = ({
  amt,
  tick,
  isMint,
  isReceived,
  className = '',
}) => {
  const formattedAmount =
    tick === KAS_TICKER
      ? amt
      : isNaN(parseInt(amt, 10))
        ? '0'
        : formatNumberAbbreviated(parseInt(amt, 10) / 1e8)

  const amountDisplay = `${isMint || isReceived ? '+ ' : '- '}${formattedAmount} ${tick}`
  const amountColor = isMint || isReceived ? 'text-success' : 'text-primarytext'

  return <p className={`${amountColor} ${className}`}>{amountDisplay}</p>
}

export default TransactionAmountDisplay
