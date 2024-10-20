import React from 'react'
import useSettings from '@/hooks/useSettings'
import { getCurrencySymbol } from '@/utils/currencies' // Import the utility function

interface TotalValueProps {
  totalValue: number
}

const TotalValue: React.FC<TotalValueProps> = ({ totalValue }) => {
  const { settings } = useSettings()

  return (
    <h1 className="text-primarytext text-5xl font-rubik text-center flex-grow">
      {getCurrencySymbol(settings.currency)}
      {totalValue.toFixed(2)}
    </h1>
  )
}

export default TotalValue
