import React, { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useKrc20TokenList } from '@/hooks/kasplex/useKrc20TokenList'
import SuggestionsDropdown from './SuggestionsDropdown'

interface KRC20TokenSearchProps {
  onSearch: (ticker: string) => void
  onToggleSuggestions: (show: boolean) => void // New prop
}

const SearchBar: React.FC<KRC20TokenSearchProps> = ({ onSearch, onToggleSuggestions }) => {
  const [ticker, setTicker] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const krc20TokenListQuery = useKrc20TokenList()

  useEffect(() => {
    onToggleSuggestions(showSuggestions)
  }, [showSuggestions, onToggleSuggestions])

  const filteredTokens = ticker
    ? krc20TokenListQuery.data?.filter((token) => token.tick.toLowerCase().includes(ticker.toLowerCase()))
    : []

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

      {showSuggestions && filteredTokens && filteredTokens.length > 0 && (
        <SuggestionsDropdown filteredTokens={filteredTokens} onSuggestionClick={handleSuggestionClick} />
      )}
    </div>
  )
}

export default SearchBar
