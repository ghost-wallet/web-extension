import React, { useState, useEffect } from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import { validateAmountToSend } from '@/utils/validation'
import ValueAndAvailableBalance from '@/pages/Wallet/Swap/ValueAndAvailableBalance'
import useChaingeTokenData from '@/hooks/chainge/useChaingeTokenData'
import { formatNumberWithDecimal } from '@/utils/formatting'

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
  const { formattedCurrencyValue, formattedBalance, tokenSymbol } = useChaingeTokenData(
    payAmount && !isNaN(Number(payAmount)) ? payAmount : '0',
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

  const maxBalance = tokens.find(
    (token) => token.tick === payToken?.symbol || token.tick === payToken?.contractAddress,
  )?.balance

  const handleMaxClick = () => {
    if (maxBalance) {
      const formattedMaxBalance = formatNumberWithDecimal(maxBalance, payToken?.decimals || 0)
      onAmountChange({
        target: { value: formattedMaxBalance.toString() },
      } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.replace(/[^0-9.]/g, '')

    const [whole, decimals] = value.split('.')
    const allowedDecimals = payToken?.decimals || 0
    const truncatedDecimals = decimals?.slice(0, allowedDecimals)

    const validatedValue = truncatedDecimals !== undefined ? `${whole}.${truncatedDecimals}` : whole
    onAmountChange({
      target: { value: validatedValue },
    } as React.ChangeEvent<HTMLInputElement>)
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
        showMaxButton={payToken?.symbol !== 'KAS'}
        onMaxClick={handleMaxClick}
      />
    </div>
  )
}

export default YouPaySection
