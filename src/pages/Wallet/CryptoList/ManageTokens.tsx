import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import ErrorMessage from '@/components/messages/ErrorMessage'
import Spinner from '@/components/loaders/Spinner'
import AnimatedMain from '@/components/AnimatedMain'
import CloseButton from '@/components/buttons/CloseButton'
import SearchBar from '@/components/search/SearchBar'
import { KaspaToken, Token } from '@/utils/interfaces'
import useInitializedEnabledTokens from '@/hooks/wallet/useInitializedEnabledTokens'
import useToggleTokenVisibility from '@/hooks/wallet/useToggleTokenVisibility'
import SearchResultsNotFound from '@/components/search/SearchResultsNotFound'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'

const ManageTokens: React.FC = () => {
  const navigate = useNavigate()
  const { tokens, errorMessage } = useWalletTokens()
  const [enabledTokens, setEnabledTokens] = useInitializedEnabledTokens(tokens as Partial<Token>[])
  const toggleTokenVisibility = useToggleTokenVisibility(setEnabledTokens)
  const [filteredTokens, setFilteredTokens] = useState<(Token | KaspaToken)[]>(tokens)
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleSearch = (_searchTerm: string) => {
    setSearchTerm(_searchTerm)
    const filtered = tokens.filter((token) => token.tick.toLowerCase().includes(_searchTerm.toLowerCase()))
    setFilteredTokens(filtered)
  }

  return (
    <>
      <AnimatedMain className="flex flex-col h-screen w-full overflow-y-auto pt-4">
        <div className="px-4 -mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
        {errorMessage && (
          <ErrorMessage message={errorMessage} className="h-6 mb-4 mt-2 flex justify-center items-center" />
        )}
        {!tokens.length && !errorMessage && <Spinner />}
        {filteredTokens.length > 0 ? (
          <ul className="space-y-3 pb-28 pt-4">
            {filteredTokens.map((token) => (
              <li key={token.tick} className="w-full text-left transition-colors rounded-lg px-4">
                <CryptoListItem
                  token={token}
                  showToggle={true}
                  isEnabled={enabledTokens[token.tick] || false}
                  onToggle={() => toggleTokenVisibility(token.tick)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4">
            <SearchResultsNotFound searchTerm={searchTerm} filteredTokens={filteredTokens} />
          </div>
        )}
      </AnimatedMain>
      <BottomFixedContainer shadow={true} className="bg-bgdark border-t border-darkmuted p-4">
        <CloseButton onClick={() => navigate('/wallet')} />
      </BottomFixedContainer>
    </>
  )
}

export default ManageTokens
