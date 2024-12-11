import React from 'react'
import { useKaspaPrice } from '@/hooks/ghost/usePrice'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface MintSummaryProps {
  totalMintCost: number
  mintAmount: number | null
  tokenTick: string
}

const MintSummary: React.FC<MintSummaryProps> = ({ totalMintCost, mintAmount, tokenTick }) => {
  const kaspaPrice = useKaspaPrice()

  const currencyValue = Number(mintAmount ? mintAmount * kaspaPrice.data! : 0)
  const formattedCurrencyValue = formatNumberAbbreviated(currencyValue, true)

  return (
    <div className="w-full space-y-2 pt-2">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <span className="text-mutedtext text-lg">You Pay</span>
          <span className="text-primarytext text-lg text-right">
            {mintAmount ? formatNumberAbbreviated(mintAmount) : '0'} KAS
          </span>
        </div>
        <span className="text-mutedtext text-base text-right">≈ {formattedCurrencyValue}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-mutedtext text-lg">You Receive</span>
        <span className="text-primarytext text-lg text-right">
          {formatNumberAbbreviated(totalMintCost)} {tokenTick}
        </span>
      </div>
    </div>
  )
}

export default MintSummary
