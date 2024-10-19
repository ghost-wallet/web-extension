import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import kaspaSvg from '../../../assets/kaspa-kas-logo.svg'

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
    kaspaImageSrc: string,
  ) => React.ReactElement
  refresh: boolean
}

const Cryptos: React.FC<CryptoProps> = ({ onTotalValueChange, renderTokenItem, refresh }) => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)
  const navigate = useNavigate()

  const [tokens, setTokens] = useState<Token[]>([])
  const [tokensError, setTokensError] = useState<string | null>(null)

  const { tokens: fetchedTokens, loading: tokensLoading, error: tokensErrorState } = useKasplex(refresh)

  useEffect(() => {
    if (!tokensLoading && fetchedTokens) {
      setTokens(fetchedTokens)
      setTokensError(null)
    }
    if (tokensErrorState) {
      setTokensError(tokensErrorState)
    }
  }, [tokensLoading, fetchedTokens, tokensErrorState])

  useTotalValueCalculation(tokens, price, onTotalValueChange)

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

  const sortedTokens = sortTokensByValue(tokens)
  const combinedTokens = [kaspaToken, ...sortedTokens]
  const currencySymbol = getCurrencySymbol(settings.currency)

  const handleTokenClick = (token: Token) => {
    navigate('/send/crypto', { state: { token } })
  }

  return (
    <div className="w-full p-4 mb-20">
      {combinedTokens.length === 0 ? (
        <p className="text-base text-mutedtext font-lato">None</p>
      ) : (
        <ul className="space-y-3">
          {combinedTokens.map((token) =>
            renderTokenItem ? (
              renderTokenItem(token, token.tick === 'KASPA', currencySymbol, kaspa.balance, kaspaSvg)
            ) : (
              <li
                key={token.opScoreMod}
                onClick={() => handleTokenClick(token)}
                className="w-full text-left transition-colors hover:cursor-pointer rounded-lg" // Make sure the rounded-lg is applied here
              >
                <TokenListItem
                  token={token}
                  isKaspa={token.tick === 'KASPA'}
                  currencySymbol={currencySymbol}
                  kaspaBalance={kaspa.balance}
                  kaspaImageSrc={kaspaSvg}
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
