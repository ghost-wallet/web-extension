import React from 'react'
import { formatBalance, formatBalanceWithAbbreviation } from '@/utils/formatting'
import CryptoImage from '@/components/cryptos/CryptoImage'

interface CryptoListItemProps {
  token: {
    tick: string
    balance: string
    dec: string
    floorPrice?: number
  }
  currencySymbol: string
  kaspaBalance: number
}

const CryptoListItem: React.FC<CryptoListItemProps> = ({ token, currencySymbol, kaspaBalance }) => {
  const numericalBalance =
    token.tick === 'KASPA' ? kaspaBalance : parseFloat(String(formatBalance(token.balance, token.dec))) // Ensure formatBalance receives a string

  const formattedBalance = formatBalanceWithAbbreviation(numericalBalance)

  const totalValue = (
    token.tick === 'KASPA'
      ? kaspaBalance * (token.floorPrice ?? 0)
      : parseFloat(String(formatBalance(token.balance, token.dec))) * (token.floorPrice ?? 0)
  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // Ensure commas and 2 decimals

  return (
    <div className="flex items-center justify-between w-full p-3 bg-darkmuted hover:bg-slightmuted transition-colors rounded-[15px]">
      <div className="flex items-center">
        <CryptoImage ticker={token.tick} size={'small'} />
        <span className="ml-4 text-lg text-primarytext font-lato">{token.tick}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg text-primarytext font-lato">
          {currencySymbol}
          {totalValue}
        </span>
        <span className="text-base text-mutedtext font-lato">{formattedBalance}</span>
      </div>
    </div>
  )
}

export default CryptoListItem
