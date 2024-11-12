import React from 'react'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'

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
      <span className="text-mutedtext text-base">Available: {formattedBalance.toLocaleString()}</span>
    </div>
  )
}

export default ValueAndAvailableBalance
