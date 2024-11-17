import React from 'react'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface ValueAndAvailableBalanceProps {
  formattedCurrencyValue: string
  formattedBalance: string | number
}

const ValueAndAvailableBalance: React.FC<ValueAndAvailableBalanceProps> = ({
  formattedCurrencyValue,
  formattedBalance,
}) => {
  return (
    <div className="flex justify-between mt-2">
      <EstimatedCurrencyValue formattedCurrencyValue={formattedCurrencyValue} />
      <span className="text-mutedtext text-base">
        Available: {formatNumberAbbreviated(Number(formattedBalance))}
      </span>
    </div>
  )
}

export default ValueAndAvailableBalance
