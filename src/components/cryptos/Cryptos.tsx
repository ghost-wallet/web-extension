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

interface Token {
  tick: string
  balance: string
  dec: string
  opScoreMod: string
  floorPrice?: number
}

interface CryptoProps {
  onTotalValueChange: (value: number) => void
  renderTokenItem?: (
    token: Token,
    isKaspa: boolean,
    currencySymbol: string,
    kaspaBalance: number,
  ) => React.ReactElement
}

const Cryptos: React.FC<CryptoProps> = ({ onTotalValueChange, renderTokenItem }) => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useKaspaPrice(settings.currency)
  const navigate = useNavigate()
  const location = useLocation()

  const [tokens, setTokens] = useState<Token[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTokens = async () => {
      // TODO Fix remove caching? It's already cached in the hook
      const cacheKey = `tokens_${kaspa.addresses[0][0]}`
      const cachedTokens = localStorage.getItem(cacheKey)

      if (cachedTokens) {
        // Load cached tokens immediately
        try {
          setTokens(JSON.parse(cachedTokens))
          setInitialLoading(false) // Show cached data immediately
        } catch (error) {
          console.error('Error parsing cached tokens:', error)
        }
      }

      // Fetch new tokens in the background
      try {
        const fetchedTokens = await fetchKrc20Tokens(settings.selectedNode, kaspa.addresses[0][0], price)
        setTokens(fetchedTokens) // Update with newly fetched tokens
        setError(null)
      } catch (error) {
        setError('Error loading tokens')
      }
    }

    loadTokens()
  }, [kaspa.addresses, price, settings.selectedNode])

  useTotalValueCalculation(tokens, price, onTotalValueChange)

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
    balance: kaspa.balance.toString(),
    dec: '8',
    opScoreMod: 'kaspa-unique',
    floorPrice: price,
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
          {sortedCryptos.map((token) =>
            renderTokenItem ? (
              renderTokenItem(token, token.tick === 'KASPA', currencySymbol, kaspa.balance)
            ) : (
              <li
                key={token.opScoreMod}
                onClick={() => handleTokenClick(token)}
                className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
              >
                <CryptoListItem token={token} currencySymbol={currencySymbol} kaspaBalance={kaspa.balance} />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}

export default Cryptos
