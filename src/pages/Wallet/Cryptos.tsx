import React, { useEffect, useState } from 'react'
import { sortTokensByValue } from '@/utils/sorting'
import useSettings from '@/hooks/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/useKaspa'
import useCoingecko from '@/hooks/useCoingecko'
import TokenListItem from '@/components/TokenListItem'
import useTotalValueCalculation from '@/hooks/useTotalValueCalculation'
import { getCurrencySymbol } from '@/utils/currencies'
import useKasplex from '@/hooks/useKasplex'
import ErrorMessage from '@/components/ErrorMessage'

interface CryptoProps {
  onTotalValueChange: (value: number) => void
  renderTokenItem?: (
    token: Token,
    isKaspa: boolean,
    currencySymbol: string,
    kaspaBalance: number,
    kaspaImageSrc: string,
  ) => React.ReactElement
  refresh: boolean
}

interface Token {
  tick: string
  balance: string
  dec: string
  opScoreMod: string
  floorPrice?: number
}

const Cryptos: React.FC<CryptoProps> = ({ onTotalValueChange, renderTokenItem, refresh }) => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  const [tokens, setTokens] = useState<Token[]>([]) // Tokens state
  const [tokensError, setTokensError] = useState<string | null>(null) // Error state

  const { tokens: fetchedTokens, loading: tokensLoading, error: tokensErrorState } = useKasplex(refresh) // Pass refresh state to useKasplex hook

  useEffect(() => {
    if (!tokensLoading && !tokensErrorState) {
      setTokens(fetchedTokens)
      setTokensError(null)
    } else if (tokensErrorState) {
      setTokensError(tokensErrorState)
    }
  }, [tokensLoading, fetchedTokens, tokensErrorState, refresh])

  useTotalValueCalculation(tokens, price, onTotalValueChange)

  // Show the loading spinner if either the network or the tokens are loading
  if (tokensLoading) {
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  }

  if (tokensError) {
    return <ErrorMessage message={tokensError} />
  }

  const kaspaToken: Token = {
    tick: 'KASPA',
    balance: kaspa.balance.toString(),
    dec: '8',
    opScoreMod: 'kaspa-unique',
    floorPrice: price,
  }

  const kaspaImageSrc = '/kaspa-kas-logo.png'
  const sortedTokens = sortTokensByValue(tokens)
  const combinedTokens = [kaspaToken, ...sortedTokens]
  const currencySymbol = getCurrencySymbol(settings.currency)

  return (
    <div className="w-full p-4 mb-20">
      {combinedTokens.length === 0 ? (
        <p className="text-base text-mutedtext font-lato">None</p>
      ) : (
        <ul>
          {combinedTokens.map((token) =>
            renderTokenItem ? (
              renderTokenItem(token, token.tick === 'KASPA', currencySymbol, kaspa.balance, kaspaImageSrc)
            ) : (
              <TokenListItem
                key={token.opScoreMod}
                token={token}
                isKaspa={token.tick === 'KASPA'}
                currencySymbol={currencySymbol}
                kaspaBalance={kaspa.balance}
                kaspaImageSrc={kaspaImageSrc}
              />
            ),
          )}
        </ul>
      )}
    </div>
  )
}

export default Cryptos
