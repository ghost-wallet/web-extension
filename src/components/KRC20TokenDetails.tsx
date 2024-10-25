import React from 'react'
import CryptoImage from '@/components/cryptos/CryptoImage'
import { formatSupplyWithAbbreviation } from '@/utils/formatting'
import { Krc20TokenInfo } from '@/hooks/kasplex/fetchKrc20TokenInfo'

interface KRC20TokenDetailsProps {
  tokenInfo: Krc20TokenInfo
}

const KRC20TokenDetails: React.FC<KRC20TokenDetailsProps> = ({ tokenInfo }) => {
  console.log('token info', tokenInfo)

  // Calculate percentages for Minted and Pre-minted
  const mintedPercentage = tokenInfo.max ? ((tokenInfo.minted / tokenInfo.max) * 100).toFixed(2) : '0'
  const preMintedPercentage = tokenInfo.max ? ((tokenInfo.pre / tokenInfo.max) * 100).toFixed(2) : '0'

  return (
    <div className="bg-bgdarker rounded-md p-3">
      <div className="flex flex-row items-center justify-center mb-3">
        <CryptoImage ticker={tokenInfo.tick} size="large" />
        <h1 className="text-primarytext font-lato font-bold text-4xl pl-4">{tokenInfo.tick}</h1>
      </div>

      <div className="space-y-0.5">
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Max Supply</span>
          <span className="text-primarytext font-lato text-lg">
            {formatSupplyWithAbbreviation(tokenInfo.max, tokenInfo.dec)}
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
          <span className="text-primarytext font-lato text-lg">{tokenInfo.mintTotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mutedtext font-lato text-lg">Holders</span>
          <span className="text-primarytext font-lato text-lg">{tokenInfo.holderTotal}</span>
        </div>
      </div>
    </div>
  )
}

export default KRC20TokenDetails
