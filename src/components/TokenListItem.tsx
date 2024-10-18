import React from 'react'
import { formatBalance, formatValue } from '@/utils/formatting'

interface TokenListItemProps {
  token: {
    tick: string
    balance: string
    dec: string
    opScoreMod: string
    floorPrice?: number
  }
  isKaspa: boolean
  currencySymbol: string
  kaspaBalance: number
  kaspaImageSrc: string
}

const TokenListItem: React.FC<TokenListItemProps> = ({
  token,
  isKaspa,
  currencySymbol,
  kaspaBalance,
  kaspaImageSrc,
}) => {
  return (
    <li className="flex items-center justify-between m-2 w-full pr-3">
      <div className="flex items-center">
        <img
          src={isKaspa ? kaspaImageSrc : `https://krc20-assets.kas.fyi/icons/${token.tick}.jpg`}
          alt={`${token.tick} logo`}
          className="w-12 h-12 rounded-full"
        />
        <span className="ml-4 text-base text-primarytext font-lato">{token.tick}</span>
      </div>
      <div className="flex flex-col items-end mr-1">
        <span className="text-sm text-primarytext font-lato">
          {isKaspa ? `${kaspaBalance.toFixed(2)}` : formatBalance(token.balance, token.dec)}
        </span>
        <span className="text-mutedtext text-sm">
          {currencySymbol}
          {isKaspa
            ? formatValue(kaspaBalance * (token.floorPrice ?? 0))
            : formatValue((token.floorPrice ?? 0) * parseFloat(formatBalance(token.balance, token.dec)))}
        </span>
      </div>
    </li>
  )
}

export default TokenListItem
