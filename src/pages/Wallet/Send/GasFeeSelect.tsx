import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FeePrioritySelector from '@/components/FeePrioritySelector'
import ErrorMessage from '@/components/messages/ErrorMessage'
import NextButton from '@/components/buttons/NextButton'
import useKaspa from '@/hooks/contexts/useKaspa'
import { useBuckets } from '@/hooks/kaspa/useBuckets'
import { FEE_TYPES } from '@/utils/constants/constants'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import BottomNav from '@/components/navigation/BottomNav'
import TopNav from '@/components/navigation/TopNav'
import ErrorMessages from '@/utils/constants/errorMessages'

const GasFeeSelect: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { request } = useKaspa()
  const { buckets, updateBuckets } = useBuckets()
  const { token, outputs, recipientError, amountError } = location.state || {}

  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1)
  const [estimatedFee, setEstimatedFee] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const selectedBucket = buckets[FEE_TYPES[currentFeeTypeIndex]]
  const selectedFeeRate = selectedBucket.feeRate || 1

  const fetchEstimatedFee = useCallback(() => {
    if (outputs && outputs[0][0].length > 0 && outputs[0][1].length > 0 && !recipientError && !amountError) {
      if (token.isKaspa) {
        request('account:estimateKaspaTransactionFee', [outputs, selectedFeeRate, '0'])
          .then((feeEstimate) => setEstimatedFee(feeEstimate))
          .catch((err) => {
            console.error('GasFeeSelect Error fetching estimated gas fee:', err)
            if (err === 'Storage mass exceeds maximum') {
              setError(ErrorMessages.FEES.STORAGE_MASS(outputs[0][1]))
            } else {
              setError(err)
            }
          })
      } else {
        request('account:getKRC20Info', [outputs[0][0], token, outputs[0][1]])
          .then((info) => request('account:estimateKRC20TransactionFee', [info, selectedFeeRate]))
          .then((feeEstimate) => setEstimatedFee(feeEstimate))
          .catch((err) => setError(err))
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

  const handleFeeTypeClick = (index: number) => {
    setCurrentFeeTypeIndex(index)
    fetchEstimatedFee()
  }

  const handleContinue = () => {
    const nextPath = token.isKaspa
      ? `/send/${token.tick}/gas-fee/confirm`
      : `/send/${token.tick}/gas-fee/confirmkrc20`
    navigate(nextPath, {
      state: {
        token,
        recipient: outputs[0][0],
        amount: outputs[0][1],
        fee: estimatedFee,
        feeRate: selectedFeeRate,
        outputs,
      },
    })
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen w-full fixed">
        <Header title="Gas Fee" showBackButton={true} />
        <div className="flex flex-col flex-grow">
          <FeePrioritySelector
            currentFeeTypeIndex={currentFeeTypeIndex}
            estimatedFee={estimatedFee}
            onFeeTypeClick={handleFeeTypeClick}
            isButtonEnabled={true}
          />
          <ErrorMessage
            message={recipientError || amountError || error || ''}
            className="h-6 mt-4 flex justify-center items-center"
          />
        </div>
      </AnimatedMain>
      <div className="bottom-20 left-0 right-0 px-4 fixed">
        <NextButton onClick={handleContinue} buttonEnabled={!!estimatedFee} />
      </div>
      <BottomNav />
    </>
  )
}

export default GasFeeSelect
