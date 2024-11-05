import React from 'react'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspaPrice from '@/hooks/kaspa/useKaspaPrice'

interface MintSummaryProps {
  totalMintCost: number
  mintAmount: number | null
  tokenTick: string
}

const MintSummary: React.FC<MintSummaryProps> = ({ totalMintCost, mintAmount, tokenTick }) => {
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const currencySymbol = getCurrencySymbol(settings.currency)

  return (
    <div className="w-full space-y-2 pt-2">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <span className="text-mutedtext text-lg">Mint cost</span>
          <span className="text-primarytext text-lg text-right">
            {mintAmount?.toLocaleString() || '0'} KAS
          </span>
        </div>
        <span className="text-mutedtext text-base text-right">
          {currencySymbol}
          {Number(mintAmount ? mintAmount * kaspaPrice.data! : '0').toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-mutedtext text-lg">Receive amount</span>
        <span className="text-primarytext text-lg text-right">
          {totalMintCost.toLocaleString()} {tokenTick}
        </span>
      </div>
    </div>
  )
}

export default MintSummary
