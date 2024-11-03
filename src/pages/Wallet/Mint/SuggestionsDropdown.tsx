import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import { checkIfMintable } from '@/utils/validation'
import { BoltIcon } from '@heroicons/react/24/outline'
import { TokenFromApi } from '@/utils/interfaces'

interface SuggestionsDropdownProps {
  filteredTokens: TokenFromApi[]
  onSuggestionClick: (ticker: string) => void
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({ filteredTokens, onSuggestionClick }) => {
  return (
    <ul className="absolute top-full mt-1 left-0 right-0 z-10 pb-20">
      {filteredTokens.map((token) => (
        <li
          key={token.tick}
          onClick={() => onSuggestionClick(token.tick)}
          className="flex items-center justify-between p-4 bg-darkmuted hover:bg-slightmuted cursor-pointer"
        >
          <div className="flex items-center">
            <div className="relative">
              <CryptoImage ticker={token.tick} size="small" />
            </div>
            <div className="ml-4">
              <p className="text-base text-mutedtext">{token.tick}</p>
            </div>
          </div>
          <div className="text-right h-8 w-8 text-primary">{checkIfMintable(token) ? <BoltIcon /> : ''}</div>
        </li>
      ))}
    </ul>
  )
}

export default SuggestionsDropdown
