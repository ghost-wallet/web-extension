import React, { useState } from 'react'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import SwapTokenListItem from '@/pages/Wallet/Swap/SwapTokenListItem'
import SearchBar from '@/components/search/SearchBar'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import CloseButton from '@/components/buttons/CloseButton'
import ErrorMessage from '@/components/messages/ErrorMessage'

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
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filteredTokens, setFilteredTokens] = useState<ChaingeToken[]>(tokens)

  const handleSearch = (_searchTerm: string) => {
    const upperSearchTerm = _searchTerm.toUpperCase().trim()

    const filterSearch = (token: ChaingeToken) => {
      // If the token is CUSDT then we want to use the contract address, Otherwise we use the symbol.
      const isCusdt = token.contractAddress === 'CUSDT'

      let tick: string

      // I was expecting `tick` to be here like the other tokens. But I guess contractAddress works?
      if (isCusdt) {
        tick = token.contractAddress
      } else {
        tick = token.symbol
      }

      const upperTick = tick.toUpperCase()

      return upperTick.includes(upperSearchTerm)
    }

    setSearchTerm(upperSearchTerm)

    // if search term is empty, set the filtered tokens list to be the original list
    if (upperSearchTerm === '') {
      setFilteredTokens(tokens)
      return
    } else {
      const filtered = tokens.filter(filterSearch)
      setFilteredTokens(filtered)
    }
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
        <div className="p-4">
          <ErrorMessage
            message={searchTerm + ' is not supported for swapping in Ghost wallet'}
            className="pt-4 flex justify-center items-center"
          />
        </div>
      )}

      <BottomFixedContainer shadow={true} className="bg-bgdark border-t border-darkmuted p-4">
        <CloseButton onClick={() => onClose()} />
      </BottomFixedContainer>
    </div>
  )
}

export default SwapTokenSelect
