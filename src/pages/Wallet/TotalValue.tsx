import React from 'react'
import useSettings from '@/hooks/useSettings'

interface KaspaBalanceProps {
  totalValue: number
}

const TotalValue: React.FC<KaspaBalanceProps> = ({ totalValue }) => {
  const { settings } = useSettings()

  return (
    <>
      <h1 className="text-primarytext text-4xl font-rubik text-center flex-grow">
        {settings.currency === 'USD'
          ? '$'
          : settings.currency === 'EUR'
            ? '€'
            : settings.currency}{' '}
        {totalValue.toFixed(2)}
      </h1>
    </>
  )
}

export default TotalValue
