import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface KRC20TokenSearchProps {
  onSearch: (ticker: string) => void
}

const SearchBar: React.FC<KRC20TokenSearchProps> = ({ onSearch }) => {
  const [ticker, setTicker] = useState('')

  const handleSearch = () => {
    if (ticker.trim() !== '') {
      onSearch(ticker)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const isInputEmpty = ticker.trim() === ''

  return (
    <div className="flex items-center w-full px-4 h-14 relative">
      <div className="flex w-full border border-muted rounded-lg overflow-hidden h-full">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter token ticker"
          className="bg-darkmuted w-full p-3 text-lg text-primarytext h-full"
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
    </div>
  )
}

export default SearchBar
