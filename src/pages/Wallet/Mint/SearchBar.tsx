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
    <div className="relative w-full">
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter token ticker"
        className="bg-darkmuted w-full p-3 pr-12 border border-muted rounded-lg font-lato text-lg text-primarytext h-12"
      />
      <button
        onClick={handleSearch}
        disabled={isInputEmpty}
        className={`absolute right-0 top-0 h-full w-12 flex items-center justify-center 
          ${isInputEmpty ? 'bg-slightmuted text-primarytext' : 'bg-primary text-secondarytext'}
          rounded-tr-lg rounded-br-lg border-t border-r border-b border-muted`} // Matching borders with input field
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
    </div>
  )
}

export default SearchBar
