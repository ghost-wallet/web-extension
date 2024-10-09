import React from 'react'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'

interface KaspaBalanceProps {
  totalValue: number
}

const KaspaBalance: React.FC<KaspaBalanceProps> = ({ totalValue }) => {
  const { kaspa } = useKaspa()
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

export default KaspaBalance
