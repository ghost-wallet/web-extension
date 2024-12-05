import React, { useState } from 'react'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import SwapTokenListItem from '@/pages/Wallet/Swap/SwapTokenListItem'
import SearchBar from '@/components/search/SearchBar'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import CloseButton from '@/components/buttons/CloseButton'

interface SwapTokenSelectProps {
  tokens?: ChaingeToken[]
  onSelectToken: (token: ChaingeToken) => void
  onClose: () => void
}

const SwapTokenSelect: React.FC<SwapTokenSelectProps> = ({ tokens = [], onSelectToken, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredTokens, setFilteredTokens] = useState<ChaingeToken[]>(tokens)

  const handleSearch = (_searchTerm: string) => {
    setSearchTerm(_searchTerm)
    const filtered = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(_searchTerm.toLowerCase()) ||
        token.contractAddress.toLowerCase().includes(_searchTerm.toLowerCase()),
    )
    setFilteredTokens(filtered)
  }

  return (
    <div className="fixed inset-0 z-50 bg-bgdark bg-opacity-90 p-4 flex-grow overflow-y-auto">
      <SearchBar onSearch={handleSearch} />

      {filteredTokens.length > 0 ? (
        <ul className="space-y-3 pb-28">
          {filteredTokens.map((token: ChaingeToken) => (
            <li
              key={token.contractAddress}
              onClick={() => onSelectToken(token)}
              className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
            >
              <SwapTokenListItem token={token} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-mutedtext text-base text-center">
          {searchTerm.toUpperCase() + ' is not supported for swapping in Ghost Wallet'}
        </p>
      )}

      <BottomFixedContainer shadow={true} className="bg-bgdark border-t border-darkmuted p-4">
        <CloseButton onClick={() => onClose()} />
      </BottomFixedContainer>
    </div>
  )
}

export default SwapTokenSelect
