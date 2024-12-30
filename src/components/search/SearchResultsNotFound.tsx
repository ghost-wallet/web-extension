import React from 'react'
import { AccountToken } from '@/types/interfaces'

interface SearchResultsNotFoundProps {
  searchTerm: string
  filteredTokens: (AccountToken)[]
}

const SearchResultsNotFound: React.FC<SearchResultsNotFoundProps> = ({ searchTerm, filteredTokens }) => {
  return (
    filteredTokens.length === 0 && (
      <p className="text-mutedtext text-base text-center">
        You don't have any {searchTerm.toUpperCase()} in your wallet. Transfer KRC20 tokens to your wallet
        using your receive address and they will appear here.
      </p>
    )
  )
}

export default SearchResultsNotFound
