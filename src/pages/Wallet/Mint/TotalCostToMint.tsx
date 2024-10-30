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
        <span className="text-mutedtext text-lg">Total</span>
        <span className="text-primarytext text-lg">{totalFees?.toLocaleString() || '0'} KAS</span>
      </div>
      <span className="text-mutedtext text-lg text-right">
        {currencySymbol}
        {kaspaPrice.isPending ? 'Loading' : (totalFees ? Number(totalFees) * kaspaPrice.data! : 0).toFixed(2)}
      </span>
    </div>
  )
}

export default TotalCostToMint
