import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sortTokensByValue } from '@/utils/sorting'
import { useTotalValueCalculation } from '@/hooks/useTotalValueCalculation'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/contexts/useKaspa'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import CryptoListItem from '@/components/cryptos/CryptoListItem'
import ErrorMessage from '@/components/ErrorMessage'
import { fetchKrc20Tokens } from '@/hooks/kasplex/fetchKrc20Tokens'
import { Token } from '@/utils/interfaces'

interface CryptoListProps {
  onTotalValueChange: (value: number) => void
}

const CryptoList: React.FC<CryptoListProps> = ({ onTotalValueChange }) => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const navigate = useNavigate()
  const location = useLocation()
  const [tokens, setTokens] = useState<Token[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTokens = async () => {
      const cacheKey = `tokens_${kaspa.addresses[0]}`
      const cachedTokens = localStorage.getItem(cacheKey)

      if (cachedTokens) {
        try {
          setTokens(JSON.parse(cachedTokens))
        } catch (error) {
          console.error('Error parsing cached tokens:', error)
        }
      }

      try {
        const fetchedTokens = await fetchKrc20Tokens(settings.selectedNode, kaspa.addresses[0], kaspaPrice)
        setTokens(fetchedTokens)
        localStorage.setItem(cacheKey, JSON.stringify(fetchedTokens)) // Update cache
        setError(null)
      } catch (error) {
        setError('Error loading tokens')
      } finally {
        setInitialLoading(false)
      }
    }

    loadTokens()
  }, [kaspa.addresses, kaspaPrice, settings.selectedNode])

  useTotalValueCalculation(tokens, kaspaPrice, onTotalValueChange)

  if (initialLoading) {
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const kaspaCrypto: Token = {
    tick: 'KASPA',
    balance: kaspa.balance,
    dec: 8,
    opScoreMod: 'kaspa-unique',
    floorPrice: kaspaPrice,
  }

  const cryptos = [...tokens, kaspaCrypto]
  const sortedCryptos = sortTokensByValue(cryptos)
  const currencySymbol = getCurrencySymbol(settings.currency)

  const handleTokenClick = (token: Token) => {
    if (location.pathname.includes('/send')) {
      navigate(`/send/${token.tick}`, { state: { token } })
    } else if (location.pathname.includes('/wallet')) {
      navigate(`/wallet/${token.tick}`, { state: { token } })
    }
  }

  return (
    <div className="w-full p-4 mb-20 h-full overflow-auto">
      {sortedCryptos.length === 0 ? (
        <p className="text-base text-mutedtext font-lato">None</p>
      ) : (
        <ul className="space-y-3">
          {sortedCryptos.map((token) => (
            <li
              key={token.opScoreMod}
              onClick={() => handleTokenClick(token)}
              className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
            >
              <CryptoListItem token={token} currencySymbol={currencySymbol} kaspaBalance={kaspa.balance} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CryptoList
