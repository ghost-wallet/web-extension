import React from 'react'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspaPrice from '@/hooks/useKaspaPrice'

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
    <div className="w-full max-w-md space-y-2 mt-6">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <span className="text-mutedtext text-lg">Mint cost</span>
          <span className="text-primarytext text-lg">
            {mintAmount?.toLocaleString() || '0'} KAS
          </span>
        </div>
        <span className="text-mutedtext text-base text-right">
          {currencySymbol}
          {Number(mintAmount ? mintAmount * kaspaPrice : '0').toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-mutedtext text-lg">Receive amount</span>
        <span className="text-primarytext text-lg">
          {totalMintCost.toLocaleString()} {tokenTick}
        </span>
      </div>
    </div>
  )
}

export default MintSummary
