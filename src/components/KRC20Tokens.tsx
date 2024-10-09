import React, { useEffect } from 'react'
import useKasplex from '@/hooks/useKasplex'
import { formatValue, formatBalance } from '@/utils/formatting'
import { sortTokensByValue } from '@/utils/sorting'
import useSettings from '@/hooks/useSettings'
import Spinner from '@/components/Spinner'
import useKaspa from '@/hooks/useKaspa'
import useCoingecko from '@/hooks/useCoingecko'

interface KRC20TokensProps {
  onTotalValueChange: (value: number) => void
}

const KRC20Tokens: React.FC<KRC20TokensProps> = ({ onTotalValueChange }) => {
  const { tokens, loading, error } = useKasplex()
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  useEffect(() => {
    if (tokens.length > 0) {
      // Calculate the total value, handling possible undefined floorPrice
      const totalValue = tokens.reduce((acc, token) => {
        const tokenValue =
          (token.floorPrice ?? 0) *
          parseFloat(formatBalance(token.balance, token.dec))
        return acc + tokenValue
      }, kaspa.balance * price) // Include KASPA's value
      onTotalValueChange(totalValue)
    }
  }, [tokens, kaspa.balance, price, onTotalValueChange])

  if (loading)
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  if (error) return <p className="text-error text-base">{error}</p>

  // Create the KASPA token object
  const kaspaToken = {
    tick: 'KASPA',
    balance: kaspa.balance.toString(),
    dec: '8',
    opScoreMod: 'kaspa-unique',
    floorPrice: price,
  }

  const kaspaImageSrc = '/kaspa-kas-logo.png'

  const sortedTokens = sortTokensByValue(tokens)
  const combinedTokens = [kaspaToken, ...sortedTokens]

  const currencySymbol =
    settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : ''

  return (
    <div className="w-full p-4 mb-20">
      {combinedTokens.length === 0 ? (
        <p className="text-base text-mutedtext font-lato">None</p>
      ) : (
        <ul>
          {combinedTokens.map((token) => {
            const isKaspa = token.tick === 'KASPA'

            return (
              <li
                key={token.opScoreMod}
                className="flex items-center justify-between mb-3 w-full"
              >
                {/* Left section with image and token name */}
                <div className="flex items-center">
                  <img
                    src={
                      isKaspa
                        ? kaspaImageSrc
                        : `https://krc20-assets.kas.fyi/icons/${token.tick}.jpg`
                    }
                    alt={`${token.tick} logo`}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="ml-4 text-base text-primarytext font-lato">
                    {token.tick}
                  </span>
                </div>

                {/* Right section with balance and total value */}
                <div className="flex flex-col items-end">
                  <span className="text-sm text-primarytext font-lato">
                    {isKaspa
                      ? `${kaspa.balance.toFixed(8)}`
                      : formatBalance(token.balance, token.dec)}
                  </span>
                  <span className="text-mutedtext text-sm">
                    {currencySymbol}
                    {isKaspa
                      ? formatValue(kaspa.balance * (token.floorPrice ?? 0))
                      : formatValue(
                          (token.floorPrice ?? 0) *
                            parseFloat(formatBalance(token.balance, token.dec)),
                        )}
                  </span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default KRC20Tokens
