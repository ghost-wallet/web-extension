import React from 'react'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspaPrice from '@/hooks/kaspa/useKaspaPrice'

interface TotalCostToMintProps {
  totalFees: string
}

const TotalCostToMint: React.FC<TotalCostToMintProps> = ({ totalFees }) => {
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)

  const currencyValue = totalFees ? Number(totalFees) * kaspaPrice.data! : 0
  const formattedCurrencyValue = currencyValue.toLocaleString(undefined, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="flex flex-col justify-between pt-8">
      <div className="flex justify-between">
        <span className="text-mutedtext text-lg">Total</span>
        <span className="text-primarytext text-lg">{totalFees?.toLocaleString() || '0'} KAS</span>
      </div>
      <span className="text-mutedtext text-lg text-right">
        ≈ {kaspaPrice.isPending ? 'Loading' : formattedCurrencyValue}
      </span>
    </div>
  )
}

export default TotalCostToMint
