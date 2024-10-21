import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { sortTokensByValue } from '@/utils/sorting'
import { useTotalValueCalculation } from '@/hooks/useTotalValueCalculation'
import { getCurrencySymbol } from '@/utils/currencies'
import useSettings from '@/hooks/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/useKaspa'
import useCoingecko from '@/hooks/useCoingecko'
import CryptoListItem from '@/components/CryptoListItem'
import useKasplex from '@/hooks/useKasplex'
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
  const { kasplex } = useKasplex()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)
  const navigate = useNavigate()
  const location = useLocation()

  const [tokens, setTokens] = useState<Token[]>([])
  const [tokensError, setTokensError] = useState<string | null>(null)

  // Fetch tokens when the component mounts and when kaspa addresses change
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

  // If there's an error loading tokens, show the error message
  if (tokensError) {
    return <ErrorMessage message={tokensError} />
  }

  // Prepare the Kaspa token and merge with other tokens
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

  // Handle token click events
  const handleTokenClick = (token: Token) => {
    if (location.pathname.includes('/send')) {
      navigate('/send/crypto', { state: { token } })
    } else if (location.pathname.includes('/wallet')) {
      navigate('/wallet/crypto', { state: { token } })
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
                <CryptoListItem
                  token={token}
                  isKaspa={token.tick === 'KASPA'}
                  currencySymbol={currencySymbol}
                  kaspaBalance={kaspa.balance}
                />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}

export default Cryptos
