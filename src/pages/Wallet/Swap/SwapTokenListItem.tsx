import React from 'react'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import CryptoImage from '@/components/CryptoImage'

interface SwapTokenListItemProps {
  token: ChaingeToken
}

const SwapTokenListItem: React.FC<SwapTokenListItemProps> = ({ token }) => {
  const isCusdt = token?.contractAddress === 'CUSDT'
  return (
    <div className="flex items-center justify-between w-full p-2 bg-darkmuted hover:bg-slightmuted transition-colors rounded-[15px]">
      <div className="flex items-center">
        <CryptoImage ticker={isCusdt ? token.contractAddress : token.symbol} size="small" />
        <span className="ml-4 text-lg text-primarytext">
          {isCusdt ? token.contractAddress : token?.symbol}
        </span>
      </div>
    </div>
  )
}

export default SwapTokenListItem
