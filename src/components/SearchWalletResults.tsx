import React, { useState } from 'react'
import { useWalletTokens } from '@/hooks/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import ErrorMessage from '@/components/ErrorMessage'
import Spinner from '@/components/Spinner'
import { useNavigate, useLocation } from 'react-router-dom'
import { Token, KaspaToken } from '@/utils/interfaces'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const SearchWalletResults: React.FC = () => {
  const { tokens, errorMessage } = useWalletTokens()
  const { settings } = useSettings()
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const currencySymbol = getCurrencySymbol(settings.currency)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredTokens = tokens.filter((token) => token.tick.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleTokenClick = (token: Token | KaspaToken) => {
    const path = location.pathname.includes('/send') ? `/send/${token.tick}` : `/wallet/${token.tick}`
    navigate(path, { state: { token } })
  }

  return (
    <div className="w-full">
      {/* Search Bar TODO: make this fixed to the top */}
      <div className="relative w-full mb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-lightmuted" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="w-full pl-10 py-4 rounded-lg bg-bgdarker text-primarytext placeholder-lightmuted text-lg placeholder-text-lg border border-muted"
        />
      </div>

      {/* Error Message */}
      {errorMessage && <ErrorMessage message={errorMessage} />}

      {/* Loading Spinner */}
      {!tokens.length && !errorMessage && <Spinner />}

      {/* Filtered Token List */}
      {filteredTokens.length > 0 ? (
        <ul className="space-y-3">
          {filteredTokens.map((token) => (
            <li
              key={token.tick}
              onClick={() => handleTokenClick(token)}
              className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
            >
              <CryptoListItem token={token} currencySymbol={currencySymbol} />
            </li>
          ))}
        </ul>
      ) : (
        searchTerm && <p className="text-mutedtext text-lg text-center mt-4">No tokens found.</p>
      )}
    </div>
  )
}

export default SearchWalletResults
