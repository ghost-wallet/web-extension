import React, { useState, useEffect } from 'react'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import ErrorMessage from '@/components/messages/ErrorMessage'
import Spinner from '@/components/loaders/Spinner'
import { useNavigate, useLocation } from 'react-router-dom'
import { Token, KaspaToken } from '@/utils/interfaces'
import SearchBar from '@/components/SearchBar'
import useVisibleTokens from '@/hooks/wallet/useVisibleTokens'

const SearchWalletResults: React.FC = () => {
  const { tokens, errorMessage } = useWalletTokens()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const currencySymbol = getCurrencySymbol(settings.currency)
  const visibleTokens = useVisibleTokens(tokens)
  const [filteredTokens, setFilteredTokens] = useState<(Token | KaspaToken)[]>([])

  useEffect(() => {
    if (visibleTokens.length > 0) {
      setFilteredTokens(visibleTokens)
    }
  }, [visibleTokens])

  const handleSearch = (searchTerm: string) => {
    const filtered = visibleTokens.filter((token) =>
      token.tick.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredTokens(filtered)
  }

  const handleTokenClick = (token: Token | KaspaToken) => {
    const path = location.pathname.includes('/send') ? `/send/${token.tick}` : `/wallet/${token.tick}`
    navigate(path, { state: { token } })
  }

  return (
    <div className="w-full">
      <SearchBar onSearch={handleSearch} />
      {errorMessage && (
        <ErrorMessage message={errorMessage} className="h-6 mb-4 mt-2 flex justify-center items-center" />
      )}
      {!tokens.length && !errorMessage && <Spinner />}
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
        filteredTokens.length === 0 && (
          <p className="text-mutedtext text-lg text-center mt-4">No tokens found.</p>
        )
      )}
    </div>
  )
}

export default SearchWalletResults
