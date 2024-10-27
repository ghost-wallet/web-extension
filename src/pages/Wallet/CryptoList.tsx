import React, { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sortTokensByValue } from '@/utils/sorting'
import { useTotalValueCalculation } from '@/hooks/useTotalValueCalculation'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/contexts/useKaspa'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTokens = useCallback(async () => {
    const cacheKey = `tokens_${kaspa.addresses[0]}`
    const cachedTokens = localStorage.getItem(cacheKey)

    const kaspaCrypto: Token = {
      tick: 'KASPA',
      balance: kaspa.balance,
      dec: 8,
      opScoreMod: 'kaspa-unique',
      floorPrice: kaspaPrice,
    }

    if (cachedTokens) {
      try {
        // Parse the cached tokens and add kaspaCrypto
        const parsedTokens = JSON.parse(cachedTokens) as Token[]
        setTokens([...parsedTokens, kaspaCrypto])
      } catch (error) {
        console.error('Error parsing cached tokens:', error)
        setTokens([kaspaCrypto])
      }
    } else {
      setTokens([kaspaCrypto])
      setIsLoading(true)
    }

    if (!kaspa.connected) {
      setIsLoading(false)
      return // Exit early if not connected
    }

    try {
      const fetchedTokens = await fetchKrc20Tokens(settings.selectedNode, kaspa.addresses[0], kaspaPrice)
      const updatedTokens = [...fetchedTokens, kaspaCrypto]
      setTokens(updatedTokens)
      localStorage.setItem(cacheKey, JSON.stringify(fetchedTokens)) // Update cache without kaspaCrypto
      setError(null)
    } catch (error) {
      setError('Error loading tokens')
    } finally {
      setIsLoading(false)
    }
  }, [kaspa.addresses, kaspa.connected, kaspa.balance, kaspaPrice, settings.selectedNode])

  useEffect(() => {
    loadTokens()
  }, [loadTokens])

  // Listen for changes in kaspa.connected and re-fetch tokens if it becomes true
  useEffect(() => {
    if (kaspa.connected) {
      loadTokens()
    }
  }, [kaspa.connected, loadTokens])

  useTotalValueCalculation(tokens, kaspaPrice, onTotalValueChange)

  if (isLoading && tokens.length === 0) {
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  // Only proceed if there are valid tokens or the kaspa balance is non-zero
  const filteredCryptos = tokens.filter((token) => token && token.balance !== 0)
  const sortedCryptos = sortTokensByValue(filteredCryptos)
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
              <CryptoListItem token={token} currencySymbol={currencySymbol} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CryptoList
