import React from 'react'
import CryptoImage from '@/components/cryptos/CryptoImage'
import { formatSupplyWithAbbreviation } from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { KRC20TokenResponse } from '@/utils/interfaces'

interface KRC20TokenDetailsProps {
  token: KRC20TokenResponse
}

const KRC20TokenDetails: React.FC<KRC20TokenDetailsProps> = ({ token }) => {
  const mintedPercentage = isNaN(parseFloat(getMintedPercentage(token.minted, token.max)))
    ? '0'
    : getMintedPercentage(token.minted, token.max)
  const preMintedPercentage = isNaN(parseFloat(getMintedPercentage(token.pre, token.max)))
    ? '0'
    : getMintedPercentage(token.pre, token.max)

  const formatValue = (value: string | number | null | undefined) => {
    if (value === '0' || value === 0 || value === null || value === undefined) {
      return '0'
    }
    return value.toString()
  }

  return (
    <div className="bg-bgdarker rounded-md p-3">
      <div className="flex flex-row items-center justify-center mb-3">
        <CryptoImage ticker={token.tick} size="large" />
        <h1 className="text-primarytext font-lato font-bold text-4xl pl-4">{token.tick}</h1>
      </div>

      <div className="space-y-0.5">
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Max Supply</span>
          <span className="text-primarytext font-lato text-lg">
            {formatSupplyWithAbbreviation(Number(formatValue(token.max)), token.dec)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Minted</span>
          <span className="text-primarytext font-lato text-lg">
            {mintedPercentage === '0' ? '0%' : `${mintedPercentage}%`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Pre-minted</span>
          <span className="text-primarytext font-lato text-lg">
            {preMintedPercentage === '0' ? '0%' : `${preMintedPercentage}%`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Total mints</span>
          <span className="text-primarytext font-lato text-lg">{formatValue(token.mintTotal) || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Holders</span>
          <span className="text-primarytext font-lato text-lg">
            {formatValue(token.holderTotal) || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default KRC20TokenDetails
