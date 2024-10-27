import React from 'react'
import { formatNumberWithDecimal, formatNumberWithAbbreviation } from '@/utils/formatting'
import CryptoImage from '@/components/CryptoImage'
import { Token } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'

interface CryptoListItemProps {
  token: Token
  currencySymbol: string
}

const CryptoListItem: React.FC<CryptoListItemProps> = ({ token, currencySymbol }) => {
  const { kaspa } = useKaspa()
  const numericalBalance =
    token.tick === 'KASPA' ? kaspa.balance : formatNumberWithDecimal(token.balance, token.dec)

  const formattedBalance = formatNumberWithAbbreviation(numericalBalance)

  const totalValue = (
    token.tick === 'KASPA'
      ? kaspa.balance * (token.floorPrice ?? 0)
      : formatNumberWithDecimal(token.balance, token.dec) * (token.floorPrice ?? 0)
  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
