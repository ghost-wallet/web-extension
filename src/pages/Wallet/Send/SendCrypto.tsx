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

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { request, kaspa } = useKaspa()
  const [error, setError] = useState<string | null>(null)
  const { token } = location.state || {}

  const maxAmount = token.tick === 'KASPA' ? token.balance : formatNumberWithDecimal(token.balance, token.dec)
  const { outputs, recipientError, amountError, handleRecipientChange, handleAmountChange, handleMaxClick } =
    useTransactionInputs(token, maxAmount)

  useEffect(() => {
    if (kaspa.balance < 1) {
      setError(
        `Not enough Kaspa in wallet for network fees. You need at least 0.2 Kaspa, but you have ${kaspa.balance}.`,
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
            <div className="w-full text-right text-mutedtext font-light text-base px-4 pt-1 pb-8">
              Available {formattedBalance} {token.tick}
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

export default SendCrypto
