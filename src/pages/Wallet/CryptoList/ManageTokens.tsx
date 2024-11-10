import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import ErrorMessage from '@/components/messages/ErrorMessage'
import Spinner from '@/components/loaders/Spinner'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import TopNav from '@/components/navigation/TopNav'
import AnimatedMain from '@/components/AnimatedMain'
import CloseButton from '@/components/buttons/CloseButton'
import SearchBar from '@/components/SearchBar'
import { KaspaToken, Token } from '@/utils/interfaces'
import useInitializedEnabledTokens from '@/hooks/wallet/useInitializedEnabledTokens'
import useToggleTokenVisibility from '@/hooks/wallet/useToggleTokenVisibility'

const ManageTokens: React.FC = () => {
  const navigate = useNavigate()
  const { tokens, errorMessage } = useWalletTokens()
  const { settings } = useSettings()
  const currencySymbol = getCurrencySymbol(settings.currency)
  const [enabledTokens, setEnabledTokens] = useInitializedEnabledTokens(tokens as Partial<Token>[])
  const toggleTokenVisibility = useToggleTokenVisibility(setEnabledTokens)
  const [filteredTokens, setFilteredTokens] = useState<(Token | KaspaToken)[]>(tokens)

  const handleSearch = (searchTerm: string) => {
    const filtered = tokens.filter((token) => token.tick.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredTokens(filtered)
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full">
        <div className="px-4 -mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
        {errorMessage && (
          <ErrorMessage message={errorMessage} className="h-6 mb-4 mt-2 flex justify-center items-center" />
        )}
        {!filteredTokens.length && !errorMessage && <Spinner />}
        {filteredTokens.length > 0 && (
          <ul className="space-y-3 pb-28 pt-4">
            {filteredTokens
              .filter((token) => token.tick !== 'KASPA')
              .map((token) => (
                <li key={token.tick} className="w-full text-left transition-colors rounded-lg px-4">
                  <CryptoListItem
                    token={token}
                    currencySymbol={currencySymbol}
                    showToggle={true}
                    isEnabled={enabledTokens[token.tick] || false}
                    onToggle={() => toggleTokenVisibility(token.tick)}
                  />
                </li>
              ))}
          </ul>
        )}
      </AnimatedMain>
      <div
        className="fixed bottom-0 left-0 w-full bg-bgdark border-t border-darkmuted p-4"
        style={{ boxShadow: '0 -10px 15px rgba(0, 0, 0, 0.3)' }}
      >
        <CloseButton onClick={() => navigate('/wallet')} />
      </div>
    </>
  )
}

export default ManageTokens
