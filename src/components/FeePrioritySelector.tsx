import React, { useState, useEffect } from 'react'
import TableSection from '@/components/table/TableSection'
import { formatGasFee } from '@/utils/formatting'

interface FeePrioritySelectorProps {
  currentFeeTypeIndex: number
  estimatedFee: string
  isButtonEnabled: boolean
  onFeeTypeClick: (index: number) => void
}

const FEE_TYPE_LABELS = ['Average', 'Fast', 'Faster']

const FeePrioritySelector: React.FC<FeePrioritySelectorProps> = ({
  currentFeeTypeIndex,
  estimatedFee,
  isButtonEnabled,
  onFeeTypeClick,
}) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 300) // Duration should match animation duration
    return () => clearTimeout(timer)
  }, [currentFeeTypeIndex, estimatedFee])

  return (
    <>
      <div className="w-full flex text-mutedtext text-base py-2 px-4 gap-2">
        {FEE_TYPE_LABELS.map((type, index) => (
          <button
            key={type}
            onClick={() => onFeeTypeClick(index)}
            className={`flex-grow px-3 py-2 rounded-lg ${
              currentFeeTypeIndex === index
                ? 'bg-primary text-secondarytext'
                : 'bg-slightmuted text-primarytext'
            }`}
            style={{ userSelect: 'none' }}
            disabled={!isButtonEnabled}
          >
            {type}
          </button>
        ))}
      </div>

      <TableSection
        title=""
        rows={[{ label: 'Gas fee', value: estimatedFee ? `${formatGasFee(estimatedFee)} KAS` : '' }]}
        className={`px-4 py-1 ${animate ? 'fade-animation' : ''}`}
      />
    </>
  )
}

export default FeePrioritySelector
