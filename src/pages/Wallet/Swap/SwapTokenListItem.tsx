import React from 'react'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import CryptoImage from '@/components/CryptoImage'
import { getChaingeTicker } from '@/utils/labels'

interface SwapTokenListItemProps {
  token: ChaingeToken
}

const SwapTokenListItem: React.FC<SwapTokenListItemProps> = ({ token }) => {
  const ticker = getChaingeTicker(token)
  return (
    <div className="flex items-center justify-between w-full p-2 bg-darkmuted hover:bg-slightmuted transition-colors rounded-[15px]">
      <div className="flex items-center">
        <CryptoImage ticker={ticker} size="small" />
        <span className="ml-4 text-lg text-primarytext">{ticker}</span>
      </div>
    </div>
  )
}

export default SwapTokenListItem
