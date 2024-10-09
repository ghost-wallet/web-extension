import React from 'react'
import useKasplex from '@/hooks/useKasplex'
import { formatValue, formatBalance } from '@/utils/formatting'
import { sortTokensByValue } from '@/utils/sorting'
import useSettings from '@/hooks/useSettings'
import Spinner from '@/components/Spinner' // Import the spinner component

const KRC20Tokens: React.FC = () => {
  const { tokens, loading, error } = useKasplex()
  const { settings } = useSettings()

  if (loading)
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  if (error) return <p className="text-error text-base">{error}</p>

  const sortedTokens = sortTokensByValue(tokens)
  const currencySymbol =
    settings.currency === 'USD' ? '$' : settings.currency === 'EUR' ? '€' : ''

  return (
    <div className="w-full p-4 mb-20">
      {sortedTokens.length === 0 ? (
        <p className="text-base text-mutedtext font-lato">None</p>
      ) : (
        <ul>
          {sortedTokens.map((token) => (
            <li
              key={token.opScoreMod}
              className="flex items-center justify-between mb-3 w-full"
            >
              {/* Left section with image and token name */}
              <div className="flex items-center">
                <img
                  src={`https://krc20-assets.kas.fyi/icons/${token.tick}.jpg`}
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
                  {formatBalance(token.balance, token.dec)}
                </span>
                <span className="text-mutedtext text-sm">
                  {currencySymbol}
                  {formatValue(token.totalValue)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default KRC20Tokens
