import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'
import ErrorMessage from '@/components/ErrorMessage'
import FeePrioritySelector from '@/components/FeePrioritySelector'
import { FEE_TYPES } from '@/utils/constants'
import useKaspa from '@/hooks/contexts/useKaspa'
import { useBuckets } from '@/hooks/useBuckets'
import ReviewMintButton from '@/pages/Wallet/Mint/CreateMint/ReviewMintButton'

const NetworkFeeSelect: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { request } = useKaspa()
  const { token, payAmount, receiveAmount } = location.state || {}

  const { buckets, updateBuckets } = useBuckets()
  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1) // Start with 'standard'
  const [networkFee, setNetworkFee] = useState<number>(1)
  const [estimatedSeconds, setEstimatedSeconds] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const selectedBucket = buckets[FEE_TYPES[currentFeeTypeIndex]]
  const feeRate = selectedBucket.feeRate || 1
  const estimatedTime = selectedBucket.seconds || 1

  const fetchEstimatedFee = useCallback(() => {
    request('account:estimateKRC20MintFees', [token.tick, feeRate, payAmount])
      .then((response) => {
        console.log('response fees:', response)
        setNetworkFee(Number(response[1]))
        setEstimatedSeconds(estimatedTime)
        setError(null)
      })
      .catch((err) => {
        setError('Error estimating fees')
        console.error(`Error estimating mint fees: ${err}`)
      })
  }, [request, token, feeRate, payAmount, estimatedTime])

  useEffect(() => {
    fetchEstimatedFee()
    const intervalId = setInterval(() => {
      updateBuckets()
      fetchEstimatedFee()
    }, 5000) // Refresh every 5 seconds
    return () => clearInterval(intervalId)
  }, [fetchEstimatedFee, updateBuckets])

  const handleFeeTypeClick = () => {
    const nextIndex = (currentFeeTypeIndex + 1) % FEE_TYPES.length
    setCurrentFeeTypeIndex(nextIndex)
  }

  const handleNext = () => {
    navigate(`/mint/${token.tick}/network-fee/review`, {
      state: {
        token,
        payAmount,
        receiveAmount,
        networkFee,
        feeRate,
      },
    })
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Network Fee" showBackButton={true} />
        <div className="flex flex-col items-center space-y-4 px-4 pt-4">
          <FeePrioritySelector
            currentFeeTypeIndex={currentFeeTypeIndex}
            // TODO change estimatedFee to be number in FeePrioritySelector component
            estimatedFee={networkFee.toString()}
            estimatedSeconds={estimatedSeconds}
            isButtonEnabled={true}
            onFeeTypeClick={handleFeeTypeClick}
          />
          {error && <ErrorMessage message={error} />}
        </div>
        <div className="px-4 pt-32">
          <ReviewMintButton isMintAmountValid={true} onClick={handleNext} showError={false} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default NetworkFeeSelect
