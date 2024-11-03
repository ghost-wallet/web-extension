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
import NextButton from '@/components/buttons/NextButton'
import TopNav from '@/components/TopNav'

const MintNetworkFee: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { request } = useKaspa()
  const { token, payAmount, receiveAmount } = location.state || {}

  const { buckets, updateBuckets } = useBuckets()
  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1) // Start with 'standard'
  const [networkFee, setNetworkFee] = useState<string>('0')
  const [serviceFee, setServiceFee] = useState<string>('0')
  const [totalFees, setTotalFees] = useState<string>('0')
  const [error, setError] = useState<string | null>(null)

  const selectedBucket = buckets[FEE_TYPES[currentFeeTypeIndex]]
  const feeRate = selectedBucket.feeRate || 1
  const estimatedTime = selectedBucket.seconds || 1

  const fetchEstimatedFee = useCallback(() => {
    request('account:estimateKRC20MintFees', [token.tick, feeRate, payAmount])
      .then((response) => {
        const { extraNetworkFees, serviceFee, totalFees } = response
        setNetworkFee(extraNetworkFees)
        setServiceFee(serviceFee)
        setTotalFees(totalFees)
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

  // Update the function to set the clicked fee type index directly
  const handleFeeTypeClick = (index: number) => {
    setCurrentFeeTypeIndex(index)
  }

  const handleNext = () => {
    navigate(`/mint/${token.tick}/network-fee/review`, {
      state: {
        token,
        payAmount,
        receiveAmount,
        networkFee,
        serviceFee,
        totalFees,
        feeRate,
      },
    })
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen fixed w-full">
        <Header title="Network Fee" showBackButton={true} />
        <div className="flex flex-col flex-grow">
          <FeePrioritySelector
            currentFeeTypeIndex={currentFeeTypeIndex}
            estimatedFee={networkFee.toString()}
            isButtonEnabled={true}
            onFeeTypeClick={handleFeeTypeClick}
          />
        </div>
        <ErrorMessage message={error || ''} />
      </AnimatedMain>
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <NextButton onClick={handleNext} showError={false} />
      </div>
      <BottomNav />
    </>
  )
}

export default MintNetworkFee
