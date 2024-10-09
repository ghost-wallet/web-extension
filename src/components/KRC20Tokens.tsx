import React from 'react'
import useKasplex from '@/hooks/useKasplex'
import { formatBalance } from '@/utils/formatBalance'

const KRC20Tokens: React.FC = () => {
  const { tokens, loading, error } = useKasplex()

  if (loading) return <p className="text-mutedtext text-base">Loading...</p>
  if (error) return <p className="text-error text-base">{error}</p>

  return (
    <div className="w-full py-4 mb-20">
      {tokens.length === 0 ? (
        <p className="text-base text-mutedtext font-lato">None</p>
      ) : (
        <ul>
          {tokens.map((token) => {
            // Calculate total value as floorPrice * balance
            const totalValue =
              (token.floorPrice || 0) *
              parseFloat(formatBalance(token.balance, token.dec))

            return (
              <li
                key={token.opScoreMod}
                className="flex items-center justify-between mb-2 w-full"
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
                  <span className="text-base text-primarytext font-lato">
                    {formatBalance(token.balance, token.dec)}
                  </span>
                  <span className="text-mutedtext text-sm">
                    ${totalValue.toFixed(6)}
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
