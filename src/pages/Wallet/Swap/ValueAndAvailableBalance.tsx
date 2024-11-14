import React from 'react'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface ValueAndAvailableBalanceProps {
  currencySymbol: string
  formattedCurrencyValue: string
  formattedBalance: string | number
}

const ValueAndAvailableBalance: React.FC<ValueAndAvailableBalanceProps> = ({
  currencySymbol,
  formattedCurrencyValue,
  formattedBalance,
}) => {
  return (
    <div className="flex justify-between mt-2">
      <EstimatedCurrencyValue
        currencySymbol={currencySymbol}
        formattedCurrencyValue={formattedCurrencyValue}
      />
      <span className="text-mutedtext text-base">
        Available: {formatNumberAbbreviated(Number(formattedBalance))}
      </span>
    </div>
  )
}

export default ValueAndAvailableBalance
