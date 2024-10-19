import React from 'react'

interface TokenDetailsProps {
  token: {
    tick: string
    balance: string
    dec: string
  }
}

import kaspaSvg from '../../assets/kaspa-kas-logo.svg'

const TokenDetails: React.FC<TokenDetailsProps> = ({ token }) => (
  <div className="flex flex-col items-center mt-2">
    <img
      src={token.tick === 'KASPA' ? kaspaSvg : `https://krc20-assets.kas.fyi/icons/${token.tick}.jpg`}
      alt={`${token.tick} logo`}
      className="w-20 h-20 rounded-full"
    />
  </div>
)

export default TokenDetails
