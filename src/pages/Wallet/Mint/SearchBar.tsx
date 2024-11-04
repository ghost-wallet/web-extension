import React, { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import SuggestionsDropdown from './SuggestionsDropdown'
import { KRC20TokenResponse } from '@/utils/interfaces'
import { sortSearchResults } from '@/utils/sorting'

interface KRC20TokenSearchProps {
  onSearch: (ticker: string) => void
  onToggleSuggestions: (show: boolean) => void
  krc20TokenList: KRC20TokenResponse[]
}

const SearchBar: React.FC<KRC20TokenSearchProps> = ({ onSearch, onToggleSuggestions, krc20TokenList }) => {
  const [ticker, setTicker] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    onToggleSuggestions(showSuggestions)
  }, [showSuggestions, onToggleSuggestions])

  // TODO: sort results by volume, not market cap. MCs are unreliable due to incorrect outlier data
  const sortedTokens = ticker ? sortSearchResults(krc20TokenList, ticker) : []

  const handleSearch = () => {
    if (ticker.trim() !== '') {
      onSearch(ticker)
      setShowSuggestions(false) // Hide suggestions after search
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (tokenTicker: string) => {
    setTicker(tokenTicker)
    onSearch(tokenTicker)
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(e.target.value)
    setShowSuggestions(true)
  }

  const isInputEmpty = ticker.trim() === ''

  return (
    <div className="flex items-center w-full h-14 relative z-30">
      <div className="flex w-full border border-muted rounded-lg overflow-hidden h-full">
        <input
          type="text"
          value={ticker}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter token ticker"
          className="bg-darkmuted w-full p-3 text-lg text-primarytext h-full"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
        />
        <button
          onClick={handleSearch}
          disabled={isInputEmpty}
          className={`h-full w-12 flex items-center justify-center ${
            isInputEmpty
              ? 'bg-slightmuted text-primarytext cursor-not-allowed'
              : 'bg-primary text-secondarytext'
          }`}
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>

      {showSuggestions && sortedTokens && sortedTokens.length > 0 && (
        <SuggestionsDropdown filteredTokens={sortedTokens} onSuggestionClick={handleSuggestionClick} />
      )}
    </div>
  )
}

export default SearchBar
