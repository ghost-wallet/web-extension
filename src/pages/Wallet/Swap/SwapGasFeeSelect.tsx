import React, { useState } from 'react'
import ModalContainer from '@/components/containers/ModalContainer'
import FeePrioritySelector from '@/components/FeePrioritySelector'
import { useBuckets } from '@/hooks/kaspa/useBuckets'
import { FEE_TYPES } from '@/utils/constants/constants'
import NextButton from '@/components/buttons/NextButton'

interface SwapGasFeeSelectProps {
  gasFee: string
  onSelectFeeRate: (feeRate: number) => void
  onClose: () => void
}

const SwapGasFeeSelect: React.FC<SwapGasFeeSelectProps> = ({ gasFee, onSelectFeeRate, onClose }) => {
  const { buckets } = useBuckets()
  const [currentFeeTypeIndex, setCurrentFeeTypeIndex] = useState(1)

  const selectedBucket = buckets[FEE_TYPES[currentFeeTypeIndex]]

  const handleFeeTypeClick = (index: number) => {
    setCurrentFeeTypeIndex(index)
    onSelectFeeRate(selectedBucket.feeRate)
  }

  const handleConfirm = () => {
    onClose()
  }

  return (
    <ModalContainer title="Gas Fee" onClose={onClose}>
      <div className="flex flex-col flex-grow -mx-4">
        <FeePrioritySelector
          currentFeeTypeIndex={currentFeeTypeIndex}
          estimatedFee={gasFee}
          onFeeTypeClick={handleFeeTypeClick}
          isButtonEnabled={true}
        />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <NextButton text="Confirm" onClick={handleConfirm} buttonEnabled={true} />
      </div>
    </ModalContainer>
  )
}

export default SwapGasFeeSelect
