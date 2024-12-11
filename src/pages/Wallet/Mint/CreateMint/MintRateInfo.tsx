import React from 'react'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface MintRateInfoProps {
  mintRate: number
  tokenTick: string
}

const MintRateInfo: React.FC<MintRateInfoProps> = ({ mintRate, tokenTick }) => (
  <div className="rounded-base text-mutedtext text-base text-right pt-2">
    1 KAS ≈ {formatNumberAbbreviated(mintRate)} {tokenTick}
  </div>
)

export default MintRateInfo
