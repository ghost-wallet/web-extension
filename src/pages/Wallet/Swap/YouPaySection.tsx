import React, { useState, useEffect } from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import { validateAmountToSend } from '@/utils/validation'
import ValueAndAvailableBalance from '@/pages/Wallet/Swap/ValueAndAvailableBalance'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import { formatAndValidateAmount } from '@/utils/formatting'

interface YouPaySectionProps {
  payAmount: string
  payToken: ChaingeToken | null
  openTokenSelect: () => void
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onAmountErrorChange?: (error: string | null) => void
  tokens: any[]
}

const YouPaySection: React.FC<YouPaySectionProps> = ({
  payAmount,
  payToken,
  openTokenSelect,
  onAmountChange,
  onAmountErrorChange,
  tokens,
}) => {
  const { formattedCurrencyValue, formattedBalance, availableBalance, tokenSymbol } = useChaingeTokenData(
    payAmount,
    payToken,
    tokens,
  )

  const [amountError, setAmountError] = useState<string | null>(null)

  useEffect(() => {
    validateAmountToSend(tokenSymbol, payAmount, formattedBalance, setAmountError)
  }, [payAmount, formattedBalance, tokenSymbol])

  useEffect(() => {
    if (onAmountErrorChange) {
      onAmountErrorChange(amountError)
    }
  }, [amountError, onAmountErrorChange])

  //TODO: add max and 50% buttons
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9.]/g, '')
    if (value.split('.').length > 2) {
      return
    }
    const formattedValue = formatAndValidateAmount(value, payToken?.decimals || 0)
    if (formattedValue === null) return
    onAmountChange({ ...e, target: { ...e.target, value: formattedValue } })
    validateAmountToSend(tokenSymbol, formattedValue, availableBalance, setAmountError)
  }

  return (
    <div className="bg-darkmuted rounded-lg p-4">
      <h2 className="text-lightmuted text-base mb-2">You Pay</h2>
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={payAmount}
          onChange={handleAmountChange}
          placeholder="0"
          className={`bg-transparent text-2xl w-40 placeholder-lightmuted ${
            amountError ? 'text-error' : 'text-primarytext'
          }`}
        />
        <ChaingeTokenDropdown selectedToken={payToken} openTokenSelect={openTokenSelect} />
      </div>
      <ValueAndAvailableBalance
        formattedCurrencyValue={formattedCurrencyValue}
        formattedBalance={formattedBalance}
      />
    </div>
  )
}

export default YouPaySection
