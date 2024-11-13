import React, { useCallback, useEffect, useState } from 'react'
import ModalContainer from '@/components/ModalContainer'
import FeePrioritySelector from '@/components/FeePrioritySelector'
import { useBuckets } from '@/hooks/kaspa/useBuckets'
import { FEE_TYPES } from '@/utils/constants/constants'
import useKaspa from '@/hooks/contexts/useKaspa'
// import ErrorMessage from '@/components/messages/ErrorMessage'
import NextButton from '@/components/buttons/NextButton'

interface SwapNetworkFeeSelectProps {
  onClose: () => void
  onSelectFeeRate: (feeRate: number) => void
  feeRate: number
}

const SwapNetworkFeeSelect: React.FC<SwapNetworkFeeSelectProps> = ({ onClose, onSelectFeeRate, feeRate }) => {
  const { request } = useKaspa()

  const { buckets, updateBuckets } = useBuckets()

  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1)
  const [estimatedFee, setEstimatedFee] = useState<string>('')

  const selectedBucket = buckets[FEE_TYPES[currentFeeTypeIndex]]
  const selectedFeeRate = selectedBucket.feeRate || 1

  const fetchEstimatedFee = useCallback(() => {
    // TODO get chainge network estimated fee
    setEstimatedFee('0.001')
  }, [selectedFeeRate, request])

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

  const handleConfirm = () => {
    onClose()
  }

  return (
    <ModalContainer title="Network Fee" onClose={onClose}>
      <div className="flex flex-col flex-grow -mx-4">
        <FeePrioritySelector
          currentFeeTypeIndex={currentFeeTypeIndex}
          estimatedFee={estimatedFee}
          onFeeTypeClick={handleFeeTypeClick}
          isButtonEnabled={true}
        />
        {/*<ErrorMessage*/}
        {/*  message={''}*/}
        {/*  className="h-6 mb-4 mt-2 flex justify-center items-center"*/}
        {/*/>*/}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <NextButton text="Confirm" onClick={handleConfirm} buttonEnabled={true} />
      </div>
    </ModalContainer>
  )
}

export default SwapNetworkFeeSelect
