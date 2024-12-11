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
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import CloseButton from '@/components/buttons/CloseButton'
import AnimatedMain from '@/components/AnimatedMain'

const SearchWalletResults: React.FC = () => {
  const { tokens, walletError } = useWalletTokens()
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
    if (location.pathname.includes('/send')) {
      navigate(`/send/${token.tick}`, { state: { token } })
    } else {
      navigate(`/wallet/crypto-details/${token.tick}`, { state: { token } })
    }
  }

  return (
    <>
      <AnimatedMain className="flex flex-col h-screen w-full overflow-y-auto p-4">
        <SearchBar onSearch={handleSearch} />
        {!tokens.length && !walletError && <Spinner />}
        {filteredTokens.length > 0 ? (
          <ul className="space-y-3 pb-28">
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
        {walletError && (
          <ErrorMessage message={walletError} className="pt-4 flex justify-center items-center" />
        )}
      </AnimatedMain>
      <BottomFixedContainer shadow={true} className="bg-bgdark border-t border-darkmuted p-4">
        <CloseButton onClick={() => navigate('/wallet')} />
      </BottomFixedContainer>
    </>
  )
}

export default SearchWalletResults
