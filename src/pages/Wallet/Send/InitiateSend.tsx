import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import Header from '@/components/Header'
import ErrorMessage from '@/components/messages/ErrorMessage'
import RecipientInput from '@/components/inputs/RecipientInput'
import AmountInput from '@/components/inputs/AmountInput'
import NextButton from '@/components/buttons/NextButton'
import useKaspa from '@/hooks/contexts/useKaspa'
import { useTransactionInputs } from '@/hooks/useTransactionInputs'
import { formatNumberWithDecimal, formatTokenBalance } from '@/utils/formatting'
import useSettings from '@/hooks/contexts/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'
import CryptoImage from '@/components/CryptoImage'
import TopNav from '@/components/navigation/TopNav'
import ErrorMessages from '@/utils/constants/errorMessages'

const InitiateSend: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { request, kaspa } = useKaspa()
  const { settings } = useSettings()
  const currencySymbol = getCurrencySymbol(settings.currency)
  const { token } = location.state || {}

  const maxAmount = token.isKaspa ? token.balance : formatNumberWithDecimal(token.balance, token.dec)
  const { outputs, recipientError, amountError, handleRecipientChange, handleAmountChange, handleMaxClick } =
    useTransactionInputs(token, maxAmount, kaspa.addresses[0])

  const currencyValue = (Number(outputs[0][1]) * token.floorPrice).toFixed(2) || '0.00'
  const formattedCurrencyValue = Number(currencyValue).toLocaleString('en-US', { minimumFractionDigits: 2 })

  const error = !kaspa.connected
    ? ErrorMessages.NETWORK.NOT_CONNECTED
    : kaspa.balance < 1
      ? ErrorMessages.NETWORK.INSUFFICIENT_FUNDS(kaspa.balance)
      : null

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
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full fixed">
        <Header title={`Send ${token.tick}`} showBackButton={true} />
        <CryptoImage ticker={token.tick} size="large" />
        <div className="flex flex-col justify-between h-screen">
          <div className="flex flex-col items-center space-y-2 p-4">
            <RecipientInput
              value={outputs[0][0]}
              onChange={(e) => handleRecipientChange(e.target.value, request)}
            />
            <AmountInput
              value={outputs[0][1]}
              onChange={(e) => handleAmountChange(e.target.value)}
              onMaxClick={handleMaxClick}
              isKaspa={token.isKaspa}
            />
            <div className="w-full flex flex-wrap items-center justify-between text-lightmuted text-base pt-1 pb-4">
              <span className="whitespace-nowrap">{`≈ ${currencySymbol}${formattedCurrencyValue}`}</span>
              <span className="whitespace-nowrap">
                Available {formattedBalance} {token.tick}
              </span>
            </div>
            <ErrorMessage
              message={recipientError || amountError || error || ''}
              className="h-6 mb-4 mt-2 flex justify-center items-center"
            />
          </div>
        </div>
      </AnimatedMain>
      <div className="bottom-20 left-0 right-0 px-4 fixed">
        <NextButton onClick={handleContinue} buttonEnabled={isButtonEnabled} />
      </div>
      <BottomNav />
    </>
  )
}

export default InitiateSend
