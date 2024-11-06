import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWalletTokens } from '@/hooks/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import ErrorMessage from '@/components/messages/ErrorMessage'
import Spinner from '@/components/loaders/Spinner'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import TopNav from '@/components/navigation/TopNav'
import AnimatedMain from '@/components/AnimatedMain'
import CloseButton from '@/components/buttons/CloseButton'

const ManageTokens: React.FC = () => {
  const navigate = useNavigate()
  const { tokens, errorMessage } = useWalletTokens()
  const [enabledTokens, setEnabledTokens] = useState<{ [key: string]: boolean }>({})
  const { settings } = useSettings()
  const currencySymbol = getCurrencySymbol(settings.currency)

  const handleToggle = (tick: string) => {
    setEnabledTokens((prevState) => ({
      ...prevState,
      [tick]: !prevState[tick],
    }))
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full">
        {/* Error Message */}
        {errorMessage && <ErrorMessage message={errorMessage} />}

        {/* Loading Spinner */}
        {!tokens.length && !errorMessage && <Spinner />}

        {/* Token List with Toggle Switch */}
        {tokens.length > 0 && (
          <ul className="space-y-3 pb-28 pt-4">
            {tokens.map((token) => (
              <li key={token.tick} className="w-full text-left transition-colors rounded-lg px-4">
                <CryptoListItem
                  token={token}
                  currencySymbol={currencySymbol}
                  showToggle={true}
                  isEnabled={enabledTokens[token.tick] || false}
                  onToggle={() => handleToggle(token.tick)}
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
