import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sortTokensByValue } from '@/utils/sorting'
import { useTotalValueCalculation } from '@/hooks/useTotalValueCalculation'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/contexts/useKaspa'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import CryptoListItem from '@/pages/Wallet/CryptoList/CryptoListItem'
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

  // Ref to track ongoing fetch to prevent concurrent calls
  const fetchPromiseRef = useRef<Promise<Token[]> | null>(null)

  const loadTokens = useCallback(async () => {
    if (!kaspa.connected || kaspaPrice === 0 || !kaspa.addresses[0]) {
      setIsLoading(false)
      return
    }

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
        const parsedTokens = JSON.parse(cachedTokens) as Token[]
        const updatedTokens = [...parsedTokens, kaspaCrypto]
        setTokens(updatedTokens)
      } catch (error) {
        console.error('Error parsing cached tokens:', error)
        setTokens([kaspaCrypto])
      }
    } else {
      setTokens([kaspaCrypto])
      setIsLoading(true)
    }

    if (fetchPromiseRef.current) {
      console.log('[loadTokens] Fetch already in progress, skipping')
      return
    }

    fetchPromiseRef.current = fetchKrc20Tokens(settings.selectedNode, kaspa.addresses[0], kaspaPrice)

    try {
      const fetchedTokens = await fetchPromiseRef.current
      const updatedTokens = [...fetchedTokens, kaspaCrypto]
      setTokens(updatedTokens)
      localStorage.setItem(cacheKey, JSON.stringify(fetchedTokens))
      setError(null)
    } catch (error) {
      console.error('[loadTokens] Error loading tokens:', error)
      setError('Error loading tokens')
    } finally {
      setIsLoading(false)
      fetchPromiseRef.current = null
    }
  }, [kaspa.connected, kaspa.addresses, kaspa.balance, kaspaPrice, settings.selectedNode])

  useEffect(() => {
    if (kaspa.addresses && kaspa.addresses[0]) {
      loadTokens()
    }
  }, [loadTokens, kaspa.addresses])

  useTotalValueCalculation(tokens, kaspaPrice, onTotalValueChange)

  if ((isLoading && tokens.length === 0) || error) {
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  }

  const filteredCryptos = tokens.filter((token) => token.tick === 'KASPA' || token.balance !== 0)
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
        <div className="mt-6">
          <Spinner />
        </div>
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
