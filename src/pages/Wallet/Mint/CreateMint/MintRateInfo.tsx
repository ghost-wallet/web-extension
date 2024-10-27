import React from 'react'

interface MintRateInfoProps {
  mintRate: number
  tokenTick: string
}

const MintRateInfo: React.FC<MintRateInfoProps> = ({ mintRate, tokenTick }) => (
  <div className="rounded-base text-mutedtext text-sm font-lato text-left mt-4">
    Mint rate ~ 1 KAS = {mintRate.toLocaleString()} {tokenTick}
  </div>
)

export default MintRateInfo
