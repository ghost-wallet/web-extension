import React from 'react'
import { formatNumberWithDecimal, formatNumberAbbreviated } from '@/utils/formatting'
import CryptoImage from '@/components/CryptoImage'
import { AccountKaspaToken, AccountToken } from '@/types/interfaces'
import { Switch } from '@headlessui/react'
import { NO_DATA_SYMBOL } from '@/pages/Wallet/CryptoList/Crypto/KRC20Details'

interface CryptoListItemProps {
  token: AccountToken
  showToggle?: boolean
  isEnabled?: boolean
  onToggle?: () => void
}

const CryptoListItem: React.FC<CryptoListItemProps> = ({ token, showToggle, isEnabled, onToggle }) => {
  const numericalBalance = token.isKaspa ? token.balance : formatNumberWithDecimal(token.balance, token.dec)

  const currencyValue = numericalBalance * (token.floorPrice ?? 0)
  const formattedCurrencyValue =
    currencyValue > 0 || token.tick === 'KASPA'
      ? formatNumberAbbreviated(currencyValue, true)
      : NO_DATA_SYMBOL

  const formattedBalance = formatNumberAbbreviated(numericalBalance)

  return (
    <div
      className={`flex items-center justify-between w-full p-3 bg-darkmuted transition-colors rounded-[15px] ${
        !showToggle ? 'hover:bg-slightmuted' : ''
      }`}
    >
      <div className="flex items-center">
        <CryptoImage ticker={token.tick} size={'small'} />
        <span className="ml-4 text-lg text-primarytext">{token.tick}</span>
      </div>

      {showToggle && token.tick !== 'KASPA' ? (
        <Switch
          checked={isEnabled || false}
          onChange={onToggle}
          className={`${
            isEnabled ? 'bg-primary' : 'bg-muted'
          } relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
        >
          <span
            className={`${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
          />
        </Switch>
      ) : showToggle && token.tick === 'KASPA' ? (
        <div />
      ) : (
        <div className="flex flex-col items-end">
          <span className="text-lg text-primarytext">{formattedCurrencyValue}</span>
          <span className="text-base text-mutedtext">{formattedBalance}</span>
        </div>
      )}
    </div>
  )
}

export default CryptoListItem
