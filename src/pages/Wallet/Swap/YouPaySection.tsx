import React from 'react'
import ChaingeTokenDropdown from '@/pages/Wallet/Swap/ChaingeTokenDropdown'
import { ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import { formatTokenBalance } from '@/utils/formatting'
import useSettings from '@/hooks/contexts/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'

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
  const { settings } = useSettings()
  const currencySymbol = getCurrencySymbol(settings.currency)

  const payTokenSymbol = payToken?.symbol || 'KAS'
  const payTokenData = tokens.find(
    (token) => token.tick === payTokenSymbol || (token.tick === 'KASPA' && payTokenSymbol === 'KAS'),
  )

  const formattedBalance = payTokenData
    ? formatTokenBalance(
        Number(payTokenData.balance),
        payTokenData.tick,
        Number(payTokenData.dec),
      ).toLocaleString()
    : '0'

  const currencyValue = payTokenData ? (Number(payAmount) * payTokenData.floorPrice).toFixed(2) : '0.00'
  const formattedCurrencyValue = Number(currencyValue).toLocaleString('en-US', { minimumFractionDigits: 2 })

  return (
    <div className="bg-darkmuted rounded-lg p-4">
      <h2 className="text-lightmuted text-base mb-2">You Pay</h2>
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={payAmount}
          onChange={onAmountChange}
          placeholder="0"
          className="bg-transparent text-primarytext placeholder-lightmuted text-2xl w-40"
        />
        <ChaingeTokenDropdown selectedToken={payToken} openTokenSelect={openTokenSelect} />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-mutedtext text-base">{`≈ ${currencySymbol}${formattedCurrencyValue}`}</span>
        <span className="text-mutedtext text-base">Available: {formattedBalance}</span>
      </div>
    </div>
  )
}

export default YouPaySection
