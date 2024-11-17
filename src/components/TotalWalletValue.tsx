import React from 'react'
import useSettings from '@/hooks/contexts/useSettings'

interface TotalValueProps {
  totalValue: number
}

const TotalWalletValue: React.FC<TotalValueProps> = ({ totalValue }) => {
  const { settings } = useSettings()

  const formattedCurrencyValue = totalValue.toLocaleString(settings.currency, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <h1 className="text-primarytext font-rubik text-center flex-grow text-4xl py-4">
      {formattedCurrencyValue}
    </h1>
  )
}

export default TotalWalletValue
