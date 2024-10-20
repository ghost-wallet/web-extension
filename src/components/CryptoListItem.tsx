import React from 'react'
import { formatBalance, formatValue } from '@/utils/formatting'
import CryptoImage from '@/components/CryptoImage'

interface TokenListItemProps {
  token: {
    tick: string
    balance: string
    dec: string
    floorPrice?: number
  }
  isKaspa: boolean
  currencySymbol: string
  kaspaBalance: number
}

const CryptoListItem: React.FC<TokenListItemProps> = ({ token, isKaspa, currencySymbol, kaspaBalance }) => {
  const formatBalanceWithAbbreviation = (number: number) => {
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(0)}M` // No decimals, clean M formatting
    }
    return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="flex items-center justify-between w-full p-3 bg-darkmuted hover:bg-slightmuted transition-colors rounded-[15px]">
      <div className="flex items-center">
        <CryptoImage ticker={token.tick} size={'small'} />
        <div className="ml-4">
          <span className="text-lg text-primarytext font-lato">{token.tick}</span>
          <div className="text-base text-mutedtext font-lato">
            {isKaspa
              ? `${formatBalanceWithAbbreviation(kaspaBalance)} ${token.tick}`
              : `${formatBalanceWithAbbreviation(parseFloat(formatBalance(token.balance, token.dec)))} ${
                  token.tick
                }`}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg text-primarytext font-lato">
          {currencySymbol}
          {isKaspa
            ? formatValue(kaspaBalance * (token.floorPrice ?? 0))
            : formatValue((token.floorPrice ?? 0) * parseFloat(formatBalance(token.balance, token.dec)))}
        </span>
      </div>
    </div>
  )
}

export default CryptoListItem
