import React, { useState, useEffect } from 'react'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import ErrorMessage from '@/components/messages/ErrorMessage'
import Spinner from '@/components/loaders/Spinner'
import { useNavigate, useLocation } from 'react-router-dom'
import { Token, KaspaToken } from '@/utils/interfaces'
import SearchBar from '@/components/search/SearchBar'
import useVisibleTokens from '@/hooks/wallet/useVisibleTokens'
import SearchResultsNotFound from '@/components/search/SearchResultsNotFound'

const SearchWalletResults: React.FC = () => {
  const { tokens, errorMessage } = useWalletTokens()
  const navigate = useNavigate()
  const location = useLocation()
  const visibleTokens = useVisibleTokens(tokens)
  const [filteredTokens, setFilteredTokens] = useState<(Token | KaspaToken)[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (visibleTokens.length > 0) {
      setFilteredTokens(visibleTokens)
    }
  }, [visibleTokens])

  const handleSearch = (_searchTerm: string) => {
    setSearchTerm(_searchTerm)
    const filtered = visibleTokens.filter((token) =>
      token.tick.toLowerCase().includes(_searchTerm.toLowerCase()),
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
              <CryptoListItem token={token} />
            </li>
          ))}
        </ul>
      ) : (
        <SearchResultsNotFound searchTerm={searchTerm} filteredTokens={filteredTokens} />
      )}
    </div>
  )
}

export default SearchWalletResults
