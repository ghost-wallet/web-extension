import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sortTokensByValue } from '@/utils/sorting'
import { useTotalValueCalculation } from '@/hooks/useTotalValueCalculation'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/contexts/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/contexts/useKaspa'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import CryptoListItem from '@/components/CryptoListItem'
import useKasplex from '@/hooks/contexts/useKasplex'
import ErrorMessage from '@/components/ErrorMessage'

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
  const { kasplex, loadKrc20Tokens } = useKasplex() // Added loadTokens from context
  const { settings } = useSettings()
  const price = useKaspaPrice(settings.currency)
  const navigate = useNavigate()
  const location = useLocation()

  const [tokens, setTokens] = useState<Token[]>([])
  const [tokensError, setTokensError] = useState<string | null>(null)

  // Fetch tokens when the component mounts
  useEffect(() => {
    const fetchTokensOnMount = async () => {
      try {
        await loadKrc20Tokens() // Call loadTokens to fetch tokens
      } catch (error) {
        setTokensError('Error loading tokens')
      }
    }

    fetchTokensOnMount() // Fetch tokens every time the component is mounted
  }, [loadKrc20Tokens])

  // Update state based on kasplex tokens and loading state
  useEffect(() => {
    if (!kasplex.loading && kasplex.tokens) {
      setTokens(kasplex.tokens)
      setTokensError(null)
    }
    if (kasplex.error) {
      setTokensError(kasplex.error)
    }
  }, [kasplex.loading, kasplex.tokens, kasplex.error])

  useTotalValueCalculation(tokens, price, onTotalValueChange)

  if (kasplex.loading) {
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  }

  if (tokensError) {
    return <ErrorMessage message={tokensError} />
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
