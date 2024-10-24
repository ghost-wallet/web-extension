import React from 'react'
import { FEE_TYPES } from '@/utils/constants'

interface FeePrioritySelectorProps {
  currentFeeTypeIndex: number
  estimatedFee: string
  estimatedSeconds: number
  isButtonEnabled: boolean
  onFeeTypeClick: () => void
}

const FeePrioritySelector: React.FC<FeePrioritySelectorProps> = ({
  currentFeeTypeIndex,
  estimatedFee,
  estimatedSeconds,
  isButtonEnabled,
  onFeeTypeClick,
}) => {
  const feeTypeText = FEE_TYPES[currentFeeTypeIndex]
  console.log('Fee priority:', feeTypeText)

  return (
    <>
      <div className="w-full text-left text-mutedtext font-lato font-light text-base px-6">
        <span
          className={`font-bold ${isButtonEnabled ? 'text-primary hover:cursor-pointer' : 'text-mutedtext'}`}
          onClick={isButtonEnabled ? onFeeTypeClick : undefined}
        >
          Fee priority: {feeTypeText.charAt(0).toUpperCase() + feeTypeText.slice(1)} ~{' '}
          {estimatedSeconds.toFixed(3)} seconds
        </span>
      </div>
      <div className="w-full text-left text-mutedtext font-lato font-light text-base px-6">
        Fee: {estimatedFee ? `${estimatedFee} KAS` : <span className="invisible">Fee Placeholder</span>}
      </div>
    </>
  )
}

export default FeePrioritySelector
