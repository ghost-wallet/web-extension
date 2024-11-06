import React, { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  placeholder?: string
  onSearch: (searchTerm: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search...', onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch(term)
  }

  return (
    <div className="relative w-full mb-4">
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lightmuted" />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder={placeholder}
        className="w-full pl-10 py-4 rounded-lg bg-bgdarker text-primarytext placeholder-lightmuted text-lg placeholder-text-lg border border-muted"
      />
    </div>
  )
}

export default SearchBar
