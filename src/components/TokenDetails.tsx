import React from 'react'
import { formatBalance } from '@/utils/formatting'

interface TokenDetailsProps {
  token: {
    tick: string
    balance: string
    dec: string
  }
}

const TokenDetails: React.FC<TokenDetailsProps> = ({ token }) => (
  <div className="flex flex-col items-center mt-2">
    <img
      src={
        token.tick === 'KASPA'
          ? '/kaspa-kas-logo.png'
          : `https://krc20-assets.kas.fyi/icons/${token.tick}.jpg`
      }
      alt={`${token.tick} logo`}
      className="w-20 h-20 rounded-full mb-2"
    />
    <p className="text-primarytext text-base font-lato">
      {token.tick === 'KASPA'
        ? `${token.balance} ${token.tick}`
        : `${formatBalance(token.balance, token.dec)} ${token.tick}`}{' '}
      Available
    </p>
  </div>
)

export default TokenDetails
