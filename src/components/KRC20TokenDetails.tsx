import React from 'react'
import CryptoImage from '@/components/cryptos/CryptoImage'
import { formatSupplyWithAbbreviation } from '@/utils/formatting'
import { getMintedPercentage } from '@/utils/calculations'
import { Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'

interface KRC20TokenDetailsProps {
  token: Krc20TokenInfo
}

const KRC20TokenDetails: React.FC<KRC20TokenDetailsProps> = ({ token }) => {
  const mintedPercentage = getMintedPercentage(token.minted, token.max)
  const preMintedPercentage = getMintedPercentage(token.pre, token.max)

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
            {formatSupplyWithAbbreviation(token.max, token.dec)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Minted</span>
          <span className="text-primarytext font-lato text-lg">{mintedPercentage}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Pre-minted</span>
          <span className="text-primarytext font-lato text-lg">{preMintedPercentage}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Total mints</span>
          <span className="text-primarytext font-lato text-lg">{token.mintTotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Holders</span>
          <span className="text-primarytext font-lato text-lg">{token.holderTotal}</span>
        </div>
      </div>
    </div>
  )
}

export default KRC20TokenDetails
