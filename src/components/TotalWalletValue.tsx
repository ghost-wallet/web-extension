import React from 'react'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface TotalValueProps {
  totalValue: number
}

const TotalWalletValue: React.FC<TotalValueProps> = ({ totalValue }) => {
  const formattedCurrencyValue = formatNumberAbbreviated(totalValue, true)

  return (
    <h1 className="text-primarytext font-rubik text-center flex-grow text-4xl py-4">
      {formattedCurrencyValue}
    </h1>
  )
}

export default TotalWalletValue
