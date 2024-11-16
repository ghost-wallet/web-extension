import React from 'react'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import ModalContainer from '@/components/containers/ModalContainer'
import SwapTokenListItem from '@/pages/Wallet/Swap/SwapTokenListItem'

interface SwapTokenSelectProps {
  tokens?: ChaingeToken[]
  onSelectToken: (token: ChaingeToken) => void
  onClose: () => void
}

const SwapTokenSelect: React.FC<SwapTokenSelectProps> = ({ tokens, onSelectToken, onClose }) => {
  return (
    <ModalContainer title="Select Token" onClose={onClose}>
      <ul className="space-y-3">
        {tokens?.map((token) => (
          <li
            key={token.contractAddress}
            onClick={() => onSelectToken(token)}
            className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
          >
            <SwapTokenListItem token={token} />
          </li>
        ))}
      </ul>
    </ModalContainer>
  )
}

export default SwapTokenSelect
