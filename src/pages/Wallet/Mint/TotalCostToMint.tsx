import React from 'react'
import { usePrices } from '@/hooks/ghost/usePrice'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface TotalCostToMintProps {
  totalFees: string
}

const TotalCostToMint: React.FC<TotalCostToMintProps> = ({ totalFees }) => {
  const prices = usePrices()
  const kasPrice = prices.data?.kaspa?.price ?? 0

  const currencyValue = totalFees ? Number(totalFees) * kasPrice : 0
  const formattedCurrencyValue = formatNumberAbbreviated(currencyValue, true)

  return (
    <div className="flex flex-col justify-between pt-2">
      <div className="flex justify-between">
        <span className="text-mutedtext text-lg">Total</span>
        <span className="text-primarytext text-lg">
          {totalFees ? formatNumberAbbreviated(Number(totalFees)) : '0'} KAS
        </span>
      </div>
      <span className="text-mutedtext text-lg text-right">
        ≈ {prices.isPending ? 'Loading' : formattedCurrencyValue}
      </span>
    </div>
  )
}

export default TotalCostToMint
