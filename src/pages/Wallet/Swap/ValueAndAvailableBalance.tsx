import React from 'react'
import EstimatedCurrencyValue from '@/components/EstimatedCurrencyValue'
import { formatNumberAbbreviated } from '@/utils/formatting'

interface ValueAndAvailableBalanceProps {
  formattedCurrencyValue: string
  formattedBalance: string | number
  showMaxButton?: boolean
  onMaxClick?: () => void
}

const ValueAndAvailableBalance: React.FC<ValueAndAvailableBalanceProps> = ({
  formattedCurrencyValue,
  formattedBalance,
  showMaxButton = false,
  onMaxClick,
}) => {
  return (
    <div className="flex justify-between items-center mt-2">
      <EstimatedCurrencyValue formattedCurrencyValue={formattedCurrencyValue} />
      <div className="flex items-center space-x-2">
        <span className="text-mutedtext text-base">{formatNumberAbbreviated(Number(formattedBalance))}</span>
        {showMaxButton && (
          <button
            className="text-sm font-semibold text-mutedtext hover:text-primarytext bg-slightmuted px-2 py-0.5 rounded-full"
            onClick={onMaxClick}
          >
            MAX
          </button>
        )}
      </div>
    </div>
  )
}

export default ValueAndAvailableBalance
