import React from 'react'

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
      <span className="text-mutedtext text-base">{`≈ ${currencySymbol}${formattedCurrencyValue}`}</span>
      <span className="text-mutedtext text-base">Available: {formattedBalance.toLocaleString()}</span>
    </div>
  )
}

export default ValueAndAvailableBalance
