import React, { useState, useEffect } from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import { validateAmountToSend } from '@/utils/validation'
import ValueAndAvailableBalance from '@/pages/Wallet/Swap/ValueAndAvailableBalance'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'

interface YouPaySectionProps {
  payAmount: string
  payToken: ChaingeToken | null
  openTokenSelect: () => void
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  tokens: any[]
}

const YouPaySection: React.FC<YouPaySectionProps> = ({
  payAmount,
  payToken,
  openTokenSelect,
  onAmountChange,
  tokens,
}) => {
  const { currencySymbol, formattedCurrencyValue, formattedBalance, availableBalance, tokenSymbol } =
    useChaingeTokenData(payAmount, payToken, tokens)

  const [amountError, setAmountError] = useState<string | null>(null)

  useEffect(() => {
    validateAmountToSend(tokenSymbol, payAmount, formattedBalance, setAmountError)
  }, [payAmount, formattedBalance, tokenSymbol])

  return (
    <div className="bg-darkmuted rounded-lg p-4">
      <h2 className="text-lightmuted text-base mb-2">You Pay</h2>
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={payAmount}
          onChange={(e) => {
            onAmountChange(e)
            validateAmountToSend(tokenSymbol, e.target.value, availableBalance, setAmountError)
          }}
          placeholder="0"
          className={`bg-transparent text-2xl w-40 placeholder-lightmuted ${
            amountError ? 'text-error' : 'text-primarytext'
          }`}
        />
        <ChaingeTokenDropdown selectedToken={payToken} openTokenSelect={openTokenSelect} />
      </div>
      <ValueAndAvailableBalance
        currencySymbol={currencySymbol}
        formattedCurrencyValue={formattedCurrencyValue}
        formattedBalance={formattedBalance}
      />
    </div>
  )
}

export default YouPaySection
