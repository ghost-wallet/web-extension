import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import CryptoImage from '@/components/CryptoImage'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'
import RecipientInput from '@/components/RecipientInput'
import AmountInput from '@/components/AmountInput'
import ContinueToConfirmTxnButton from '@/components/buttons/ContinueToConfirmTxnButton'
import FeePrioritySelector from '@/components/FeePrioritySelector'
import useKaspa from '@/hooks/contexts/useKaspa'
import useURLParams from '@/hooks/useURLParams'
import { useTransactionInputs } from '@/hooks/useTransactionInputs'
import { useFeeRate } from '@/hooks/useFeeRate'
import { formatBalance, formatTokenBalance } from '@/utils/formatting'

const FEE_TYPES = ['slow', 'standard', 'fast'] as const

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = location.state || {}
  const { request } = useKaspa()
  const [hash, params] = useURLParams()
  const maxAmount = token.tick === 'KASPA' ? token.balance : formatBalance(token.balance, token.dec)
  const { feeRates, updateFeeRate } = useFeeRate()
  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1) // Start with 'standard'
  const [estimatedFee, setEstimatedFee] = useState<string>('') // Store estimated fee
  const { outputs, recipientError, amountError, handleRecipientChange, handleAmountChange, handleMaxClick } =
    useTransactionInputs(token, maxAmount)

  const selectedFeeRate = feeRates[FEE_TYPES[currentFeeTypeIndex]] || 1

  // TODO: get KRC20 script info and krc20 fee
  const fetchEstimatedFee = useCallback(() => {
    if (outputs[0][0].length > 0 && outputs[0][1].length > 0 && !recipientError && !amountError) {
      request('account:estimateKaspaTransactionFee', [outputs, selectedFeeRate, '0'])
        .then((feeEstimate) => {
          setEstimatedFee(feeEstimate) // Set the estimated fee
        })
        .catch((err) => {
          console.error(`Error estimating fee: ${err}`)
        })
    }
  }, [outputs, selectedFeeRate, request, recipientError, amountError])

  // Automatically refresh the fee rate and the estimated fee every 5 seconds
  useEffect(() => {
    fetchEstimatedFee() // Initial fetch
    const intervalId = setInterval(() => {
      updateFeeRate() // Update the fee rates from the API
      fetchEstimatedFee() // Re-fetch the estimated fee based on the updated fee rates
    }, 5000)
    return () => clearInterval(intervalId) // Clear interval on component unmount
  }, [fetchEstimatedFee, updateFeeRate])

  const initiateSend = useCallback(() => {
    request('account:create', [outputs, selectedFeeRate, estimatedFee, JSON.parse(params.get('inputs')!)])
      .then(([transactions]) => {
        navigate(`/send/${token.tick}/confirm`, {
          state: { token, recipient: outputs[0][0], amount: outputs[0][1], transactions, fee: estimatedFee },
        })
      })
      .catch((err) => {
        console.error(`Error occurred: ${err}`)
      })
  }, [outputs, token, navigate, request, selectedFeeRate, estimatedFee, params])

  const handleContinue = () => {
    if (token.tick === 'KASPA') {
      initiateSend()
    } else {
      navigate(`/send/${token.tick}/confirmkrc20`, {
        state: { token, recipient: outputs[0][0], amount: outputs[0][1], feeRate: selectedFeeRate },
      })
    }
  }

  const handleFeeTypeClick = () => {
    const nextIndex = (currentFeeTypeIndex + 1) % FEE_TYPES.length
    setCurrentFeeTypeIndex(nextIndex)
  }

  const isButtonEnabled =
    outputs[0][0].length > 0 && outputs[0][1].length > 0 && !recipientError && !amountError
  const formattedBalance = formatTokenBalance(token.balance, token.tick, token.dec)

  return (
    <>
      <AnimatedMain>
        <Header title={`Send ${token.tick}`} showBackButton={true} />
        <CryptoImage ticker={token.tick} size="large" />

        <div className="flex flex-col items-center space-y-4 p-4">
          <RecipientInput
            value={outputs[0][0]}
            onChange={(e) => handleRecipientChange(e.target.value, request)}
          />
          <AmountInput
            value={outputs[0][1]}
            onChange={(e) => handleAmountChange(e.target.value)}
            onMaxClick={handleMaxClick}
          />

          <div className="w-full text-right text-mutedtext font-lato font-light text-base">
            Available {formattedBalance} {token.tick}
          </div>
        </div>

        <FeePrioritySelector
          currentFeeTypeIndex={currentFeeTypeIndex}
          estimatedFee={estimatedFee}
          isButtonEnabled={isButtonEnabled}
          onFeeTypeClick={handleFeeTypeClick}
        />

        <ErrorMessage message={recipientError || amountError || ''} />

        <div className="px-6">
          <ContinueToConfirmTxnButton onClick={handleContinue} disabled={!isButtonEnabled} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default SendCrypto
