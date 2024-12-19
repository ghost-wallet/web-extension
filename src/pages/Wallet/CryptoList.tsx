import React from 'react'
import { useWalletTokens } from '@/hooks/wallet/useWalletTokens'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
import { useTotalValueCalculation } from '@/hooks/wallet/useTotalValueCalculation'
import { Token, KaspaToken } from '@/utils/interfaces'
import ErrorMessage from '@/components/messages/ErrorMessage'
import { useLocation, useNavigate } from 'react-router-dom'
import { usePrices } from '@/hooks/ghost/usePrice'
import useVisibleTokens from '@/hooks/wallet/useVisibleTokens'

interface CryptoListProps {
  onTotalValueChange: (value: number) => void
}

const CryptoList: React.FC<CryptoListProps> = ({ onTotalValueChange }) => {
  const { tokens, walletError } = useWalletTokens()
  const navigate = useNavigate()
  const location = useLocation()

  const prices = usePrices()
  const kasPrice = prices.data?.kaspa ?? 0

  const visibleTokens = useVisibleTokens(tokens)

  useTotalValueCalculation(visibleTokens, kasPrice, onTotalValueChange)

  const handleTokenClick = (token: Token | KaspaToken) => {
    if (location.pathname.includes('/send')) {
      navigate(`/send/${token.tick}`, { state: { token } })
    } else {
      navigate(`/wallet/crypto-details/${token.tick}`, { state: { token } })
    }
  }

  return (
    <div className="w-full p-4 mb-20 h-full overflow-auto">
      {visibleTokens.length === 0 ? (
        <p className="text-base text-mutedtext">None</p>
      ) : (
        <ul className="space-y-3">
          {visibleTokens.map((token) => (
            <li
              key={token.tick}
              onClick={() => handleTokenClick(token)}
              className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
            >
              <CryptoListItem token={token} />
            </li>
          ))}
        </ul>
      )}
      {walletError && (
        <ErrorMessage message={walletError} className="mt-2 flex justify-center items-center" />
      )}
    </div>
  )
}

export default CryptoList
