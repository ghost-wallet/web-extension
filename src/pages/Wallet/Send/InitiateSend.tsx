import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'
import RecipientInput from '@/components/inputs/RecipientInput'
import AmountInput from '@/components/inputs/AmountInput'
import NextButton from '@/components/buttons/NextButton'
import useKaspa from '@/hooks/contexts/useKaspa'
import { useTransactionInputs } from '@/hooks/useTransactionInputs'
import { formatNumberWithDecimal, formatTokenBalance } from '@/utils/formatting'
import useSettings from '@/hooks/contexts/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'
import CryptoImage from '@/components/CryptoImage'

const InitiateSend: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { request, kaspa } = useKaspa()
  const { settings } = useSettings()
  const currencySymbol = getCurrencySymbol(settings.currency)
  const [error, setError] = useState<string | null>(null)
  const { token } = location.state || {}

  const maxAmount = token.isKaspa ? token.balance : formatNumberWithDecimal(token.balance, token.dec)
  const { outputs, recipientError, amountError, handleRecipientChange, handleAmountChange, handleMaxClick } =
    useTransactionInputs(token, maxAmount, kaspa.addresses[0])

  const currencyValue = (Number(outputs[0][1]) * token.floorPrice).toFixed(2) || '0.00'
  const formattedCurrencyValue = Number(currencyValue).toLocaleString('en-US', { minimumFractionDigits: 2 })

  useEffect(() => {
    if (kaspa.balance < 1) {
      setError(
        `Not enough Kaspa in wallet to cover network fees. You need at least 1 KAS, but you have ${kaspa.balance}.`,
      )
    } else {
      setError(null)
    }
  }, [kaspa.balance])

  const handleContinue = () => {
    navigate(`/send/${token.tick}/network-fee`, {
      state: {
        token,
        outputs,
        recipientError,
        amountError,
      },
    })
  }

  const isButtonEnabled =
    outputs[0][0].length > 0 && outputs[0][1].length > 0 && !recipientError && !amountError && !error

  const formattedBalance = formatTokenBalance(token.balance, token.tick, token.dec).toLocaleString()

  return (
    <>
      <AnimatedMain className="flex flex-col h-screen">
        <Header title={`Send ${token.tick}`} showBackButton={true} />
        <CryptoImage ticker={token.tick} size="large" />
        <div className="flex flex-col justify-between h-screen">
          <div className="flex flex-col items-center space-y-4 px-4 pt-4">
            <RecipientInput
              value={outputs[0][0]}
              onChange={(e) => handleRecipientChange(e.target.value, request)}
            />
            <AmountInput
              value={outputs[0][1]}
              onChange={(e) => handleAmountChange(e.target.value)}
              onMaxClick={handleMaxClick}
            />
            <div className="w-full flex flex-wrap items-center justify-between text-lightmuted text-base pt-1 pb-4">
              <span className="whitespace-nowrap">{`≈ ${currencySymbol}${formattedCurrencyValue}`}</span>
              <span className="whitespace-nowrap">
                Available {formattedBalance} {token.tick}
              </span>
            </div>
            <ErrorMessage message={recipientError || amountError || error || ''} />
          </div>
          <div className="px-4 pb-20">
            <NextButton onClick={handleContinue} buttonEnabled={isButtonEnabled} />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default InitiateSend
