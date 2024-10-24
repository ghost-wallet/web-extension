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
import { useTransactionInputs } from '@/hooks/useTransactionInputs'
import { useBuckets } from '@/hooks/useBuckets'
import { formatBalance, formatTokenBalance } from '@/utils/formatting'
import { FEE_TYPES } from '@/utils/constants'

const SendCrypto: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { request } = useKaspa()
  const { buckets, updateBuckets } = useBuckets()
  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1) // Start with 'standard'
  const [estimatedFee, setEstimatedFee] = useState<string>('')
  const { token } = location.state || {}

  const maxAmount = token.tick === 'KASPA' ? token.balance : formatBalance(token.balance, token.dec)
  const { outputs, recipientError, amountError, handleRecipientChange, handleAmountChange, handleMaxClick } =
    useTransactionInputs(token, maxAmount)

  const selectedBucket = buckets[FEE_TYPES[currentFeeTypeIndex]]
  const selectedFeeRate = selectedBucket.feeRate || 1
  const estimatedSeconds = selectedBucket.seconds || 1

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

  // Automatically refresh the fee rate and the estimated fee every 5 seconds
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
          estimatedSeconds={estimatedSeconds} // Pass estimated seconds to FeePrioritySelector
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
