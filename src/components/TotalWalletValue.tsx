import React from 'react'
import useSettings from '@/hooks/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'

interface TotalValueProps {
  totalValue: number
}

const TotalWalletValue: React.FC<TotalValueProps> = ({ totalValue }) => {
  const { settings } = useSettings()

  return (
    <h1 className="text-primarytext font-rubik text-center flex-grow text-[40px]">
      {getCurrencySymbol(settings.currency)}
      {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </h1>
  )
}

export default TotalWalletValue
