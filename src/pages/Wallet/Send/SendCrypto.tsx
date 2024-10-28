import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'
import RecipientInput from '@/components/inputs/RecipientInput'
import AmountInput from '@/components/inputs/AmountInput'
import FeePrioritySelector from '@/components/FeePrioritySelector'
import useKaspa from '@/hooks/contexts/useKaspa'
import { useTransactionInputs } from '@/hooks/useTransactionInputs'
import { useBuckets } from '@/hooks/useBuckets'
import { formatNumberWithDecimal, formatTokenBalance } from '@/utils/formatting'
import { FEE_TYPES } from '@/utils/constants'
import NextButton from '@/components/buttons/NextButton'

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { request } = useKaspa()
  const { buckets, updateBuckets } = useBuckets()
  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1) // Start with 'standard'
  const [estimatedFee, setEstimatedFee] = useState<string>('')
  const { token } = location.state || {}

  const maxAmount = token.tick === 'KASPA' ? token.balance : formatNumberWithDecimal(token.balance, token.dec)
  const { outputs, recipientError, amountError, handleRecipientChange, handleAmountChange, handleMaxClick } =
    useTransactionInputs(token, maxAmount)

  const selectedBucket = buckets[FEE_TYPES[currentFeeTypeIndex]]
  const selectedFeeRate = selectedBucket.feeRate || 1
  const estimatedSeconds = selectedBucket.seconds || 0

  // Function to fetch the estimated fee for Kaspa or KRC20 tokens
  const fetchEstimatedFee = useCallback(() => {
    if (outputs[0][0].length > 0 && outputs[0][1].length > 0 && !recipientError && !amountError) {
      if (token.tick === 'KASPA') {
        request('account:estimateKaspaTransactionFee', [outputs, selectedFeeRate, '0'])
          .then((feeEstimate) => {
            setEstimatedFee(feeEstimate)
          })
          .catch((err) => {
            console.error(`Error estimating Kaspa fee: ${err}`)
          })
      } else {
        request('account:getKRC20Info', [outputs[0][0], token, outputs[0][1]])
          .then((info) => {
            return request('account:estimateKRC20TransactionFee', [info, selectedFeeRate])
          })
          .then((feeEstimate) => {
            setEstimatedFee(feeEstimate)
          })
          .catch((err) => {
            console.error(`Error estimating KRC20 fee: ${err}`)
          })
      }
    }
  }, [outputs, selectedFeeRate, request, recipientError, amountError, token])

  useEffect(() => {
    fetchEstimatedFee()
    const intervalId = setInterval(() => {
      updateBuckets()
      fetchEstimatedFee()
    }, 5000)
    return () => clearInterval(intervalId)
  }, [fetchEstimatedFee, updateBuckets])

  const initiateSend = useCallback(() => {
    if (token.tick === 'KASPA') {
      request('account:create', [outputs, selectedFeeRate, estimatedFee])
        .then(([transactions]) => {
          navigate(`/send/${token.tick}/confirm`, {
            state: {
              token,
              recipient: outputs[0][0],
              amount: outputs[0][1],
              transactions,
              fee: estimatedFee,
            },
          })
        })
        .catch((err) => {
          console.error(`Error occurred: ${err}`)
        })
    } else {
      navigate(`/send/${token.tick}/confirmkrc20`, {
        state: { token, recipient: outputs[0][0], amount: outputs[0][1], feeRate: selectedFeeRate },
      })
    }
  }, [outputs, token, navigate, request, selectedFeeRate, estimatedFee])

  const handleContinue = () => {
    initiateSend()
  }

  const handleFeeTypeClick = (index: number) => {
    setCurrentFeeTypeIndex(index)
  }

  const isButtonEnabled =
    outputs[0][0].length > 0 && outputs[0][1].length > 0 && !recipientError && !amountError
  const formattedBalance = formatTokenBalance(token.balance, token.tick, token.dec).toLocaleString()

  return (
    <>
      <AnimatedMain>
        <Header title={`Send ${token.tick}`} showBackButton={true} />
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
        </div>
        <div className="w-full text-right text-mutedtext font-lato font-light text-base px-4 pt-1 pb-1">
          Available {formattedBalance} {token.tick}
        </div>
        <FeePrioritySelector
          currentFeeTypeIndex={currentFeeTypeIndex}
          estimatedFee={estimatedFee}
          estimatedSeconds={estimatedSeconds}
          isButtonEnabled={isButtonEnabled}
          onFeeTypeClick={handleFeeTypeClick}
        />

        <ErrorMessage message={recipientError || amountError || ''} />

        <div className="px-4 pt-4">
          <NextButton onClick={handleContinue} buttonEnabled={isButtonEnabled} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default SendCrypto
