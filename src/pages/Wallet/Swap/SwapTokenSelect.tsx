import React, { useState } from 'react'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import ModalContainer from '@/components/containers/ModalContainer'
import SwapTokenListItem from '@/pages/Wallet/Swap/SwapTokenListItem'
import SearchBar from '@/components/search/SearchBar'

interface SwapTokenSelectProps {
  tokens?: ChaingeToken[]
  onSelectToken: (token: ChaingeToken) => void
  onClose: () => void
}

const SwapTokenSelect: React.FC<SwapTokenSelectProps> = ({ tokens, onSelectToken, onClose }) => {
  // if tokens are undefined just set it to an empty array to make this easier
  // This seems like it shouldn't ever be undefined. It's confusing why it can be, instead of just an empty array?
  if (tokens == undefined) {
    tokens = []
  }

  // Search term will be in upper
  const [filteredTokens, setFilteredTokens] = useState<ChaingeToken[]>(tokens)

  const handleSearch = (_searchTerm: string) => {
    const upperCase = _searchTerm.toUpperCase().trim()

    const filterSearch = (token: ChaingeToken) => {
      // I was expecting `tick` to be here like the other tokens. But I guess contractAddress works?
      const isCusdt = token.contractAddress === 'CUSDT'
      // If the token is CUSDT then we want to use the contract address, Otherwise we use the symbol.

      let tick: string

      if (isCusdt) {
        tick = token.contractAddress
      } else {
        tick = token.symbol
      }

      const upperTick = tick.toUpperCase()

      const result = upperTick.includes(upperCase)

      return result
    }

    // if search term is empty, set the filtered tokens list to be the original list
    if (upperCase === '') {
      setFilteredTokens(tokens)
      return
    } else {
      const filtered = tokens.filter(filterSearch)
      setFilteredTokens(filtered)
    }
  }

  return (
    <ModalContainer title="Select Token" onClose={onClose}>
      <div className="px-4 -mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>
      <ul className="space-y-3">
        {filteredTokens.map((token) => (
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
