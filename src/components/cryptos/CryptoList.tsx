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

const CryptoList: React.FC<CryptoProps> = ({ onTotalValueChange, renderTokenItem }) => {
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
      // TODO fix show cached tokens and not the loading spinner
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
        const fetchedTokens = await fetchKrc20Tokens(settings.selectedNode, kaspa.addresses[0], price)
        setTokens(fetchedTokens)
        localStorage.setItem(cacheKey, JSON.stringify(fetchedTokens)) // Update cache
        setError(null)
      } catch (error) {
        setError('Error loading tokens')
      } finally {
        setInitialLoading(false) // Ensure this runs even if an error occurs
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

export default CryptoList
