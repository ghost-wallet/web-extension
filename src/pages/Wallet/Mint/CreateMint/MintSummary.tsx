import React from 'react'

interface MintSummaryProps {
  totalMintCost: number
  mintAmount: number | null
  tokenTick: string
}

const MintSummary: React.FC<MintSummaryProps> = ({ totalMintCost, mintAmount, tokenTick }) => (
  <div className="w-full max-w-md space-y-2 mt-6">
    <div className="flex justify-between">
      <span className="text-mutedtext font-lato text-lg">Receive amount</span>
      <span className="text-primarytext font-lato text-lg">
        {totalMintCost.toLocaleString()} {tokenTick}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-mutedtext font-lato text-lg">Mint cost</span>
      <span className="text-primarytext font-lato text-lg">{mintAmount?.toLocaleString() || '0'} KAS</span>
    </div>
  </div>
)

export default MintSummary
