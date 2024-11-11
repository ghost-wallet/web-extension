import React from 'react'

interface EstimatedCurrencyValueProps {
  currencySymbol: string
  formattedCurrencyValue: string
}

const EstimatedCurrencyValue: React.FC<EstimatedCurrencyValueProps> = ({
  currencySymbol,
  formattedCurrencyValue,
}) => {
  return <span className="text-mutedtext text-base">{`≈ ${currencySymbol}${formattedCurrencyValue}`}</span>
}

export default EstimatedCurrencyValue
