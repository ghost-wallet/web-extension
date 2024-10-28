import React from 'react'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import { getCurrencySymbol } from '@/utils/currencies'

interface TotalCostToMintProps {
  totalFees: string
}

const TotalCostToMint: React.FC<TotalCostToMintProps> = ({ totalFees }) => {
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const currencySymbol = getCurrencySymbol(settings.currency)

  return (
    <div className="flex flex-col justify-between pt-8">
      <div className="flex justify-between">
        <span className="text-mutedtext font-lato text-lg">Total</span>
        <span className="text-primarytext font-lato text-lg">
          {totalFees?.toLocaleString() || '0'} KAS
        </span>
      </div>
      <span className="text-mutedtext font-lato text-base text-right">
        {currencySymbol}
        {(totalFees ? Number(totalFees) * kaspaPrice : 0).toFixed(2)}
      </span>
    </div>
  )
}

export default TotalCostToMint
