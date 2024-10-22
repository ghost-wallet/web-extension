import React from 'react'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import useSettings from '@/hooks/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'
import { formatTokenPrice } from '@/utils/formatting'

interface Token {
  tick: string
  floorPrice: number
}

interface CryptoBalanceProps {
  token: Token
}

const CryptoPrice: React.FC<CryptoBalanceProps> = ({ token }) => {
  const { floorPrice, tick } = token
  const { settings } = useSettings()
  const price = useKaspaPrice(settings.currency)
  const tokenPrice = floorPrice * price

  return (
    <div className="text-primarytext text-center p-2">
      <p className="text-lg font-lato">Price</p>
      <p className="text-xl font-lato">
        {getCurrencySymbol(settings.currency)}
        {tick === 'KASPA' ? price : formatTokenPrice(tokenPrice)} {/* Check token.tick here */}
      </p>
    </div>
  )
}

export default CryptoPrice
