import React from 'react'
import { FEE_TYPES } from '@/utils/constants'
import { ArrowUturnRightIcon } from '@heroicons/react/24/solid'

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

  return (
    <>
      <div className="w-full text-left text-mutedtext font-lato font-light text-base px-4 pt-2">
        <div
          className={`${
            isButtonEnabled ? 'bg-primary hover:cursor-pointer' : 'bg-muted'
          } text-secondarytext rounded-lg px-2 py-1 inline-flex items-center`}
          onClick={isButtonEnabled ? onFeeTypeClick : undefined}
          style={{ userSelect: 'none' }} // Prevent text selection
        >
          <ArrowUturnRightIcon className="h-5 w-5 mr-1" />
          <span className="font-bold">
            {feeTypeText.charAt(0).toUpperCase() + feeTypeText.slice(1)} ~{' '}
            {estimatedSeconds >= 60
              ? `${parseFloat((estimatedSeconds / 60).toPrecision(2))} minute${
                  parseFloat((estimatedSeconds / 60).toPrecision(2)) !== 1 ? 's' : ''
                }`
              : estimatedSeconds < 1
                ? `${parseFloat(estimatedSeconds.toPrecision(1))} second${
                    parseFloat(estimatedSeconds.toPrecision(1)) !== 1 ? 's' : ''
                  }`
                : `${parseFloat(estimatedSeconds.toPrecision(1))} second${
                    parseFloat(estimatedSeconds.toPrecision(1)) !== 1 ? 's' : ''
                  }`}
          </span>
        </div>
      </div>
      <div className="w-full text-left text-mutedtext font-lato font-light text-base px-4 pb-4">
        Fee: {estimatedFee ? `${estimatedFee} KAS` : <span className="invisible">Fee Placeholder</span>}
      </div>
    </>
  )
}

export default FeePrioritySelector
