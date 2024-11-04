import React from 'react'
import { formatNumberWithDecimal, formatNumberWithAbbreviation } from '@/utils/formatting'
import CryptoImage from '@/components/CryptoImage'
import { KaspaToken, Token } from '@/utils/interfaces'

interface CryptoListItemProps {
  token: Token | KaspaToken
  currencySymbol: string
}

const CryptoListItem: React.FC<CryptoListItemProps> = ({ token, currencySymbol }) => {
  const numericalBalance = token.isKaspa ? token.balance : formatNumberWithDecimal(token.balance, token.dec)

  const formattedBalance = formatNumberWithAbbreviation(numericalBalance)

  const totalValue = (numericalBalance * (token.floorPrice ?? 0)).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  // TODO: show loading UI or cached Kaspa data while connecting to network (don't show balance as 0)
  return (
    <div className="flex items-center justify-between w-full p-3 bg-darkmuted hover:bg-slightmuted transition-colors rounded-[15px]">
      <div className="flex items-center">
        <CryptoImage ticker={token.tick} size={'small'} />
        <span className="ml-4 text-lg text-primarytext">{token.tick}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-lg text-primarytext">
          {currencySymbol}
          {totalValue}
        </span>
        <span className="text-base text-mutedtext">{formattedBalance}</span>
      </div>
    </div>
  )
}

export default CryptoListItem
