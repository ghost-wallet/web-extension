import React from 'react'
import { useWalletTokens } from '@/hooks/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import { useTotalValueCalculation } from '@/hooks/useTotalValueCalculation'
import { Token, KaspaToken } from '@/utils/interfaces'
import ErrorMessage from '@/components/ErrorMessage'
import { useLocation, useNavigate } from 'react-router-dom'
import useKaspaPrice from '@/hooks/useKaspaPrice'

interface CryptoListProps {
  onTotalValueChange: (value: number) => void
}

const CryptoList: React.FC<CryptoListProps> = ({ onTotalValueChange }) => {
  const { tokens, errorMessage } = useWalletTokens()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const location = useLocation()

  const currencySymbol = getCurrencySymbol(settings.currency)
  const kaspaPrice = useKaspaPrice(settings.currency)
  const kasPrice = kaspaPrice.data ?? 0

  useTotalValueCalculation(tokens, kasPrice, onTotalValueChange)

  const handleTokenClick = (token: Token | KaspaToken) => {
    if (location.pathname.includes('/send')) {
      navigate(`/send/${token.tick}`, { state: { token } })
    } else if (location.pathname.includes('/wallet')) {
      navigate(`/wallet/${token.tick}`, { state: { token } })
    }
  }

  return (
    <div className="w-full p-4 mb-20 h-full overflow-auto">
      {tokens.length === 0 ? (
        <p className="text-base text-mutedtext">None</p>
      ) : (
        <ul className="space-y-3">
          {tokens.map((token) => (
            <li
              key={token.tick}
              onClick={() => handleTokenClick(token)}
              className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
            >
              <CryptoListItem token={token} currencySymbol={currencySymbol} />
            </li>
          ))}
        </ul>
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  )
}

export default CryptoList
