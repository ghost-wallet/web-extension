import React from 'react'
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline'

interface SlippageButtonProps {
  setIsSlippageOpen: (open: boolean) => void
  slippage: number
}

const SlippageButton: React.FC<SlippageButtonProps> = ({ setIsSlippageOpen, slippage }) => {
  return (
    <button
      onClick={() => setIsSlippageOpen(true)}
      className="flex items-center space-x-1 text-mutedtext hover:text-primarytext"
    >
      <AdjustmentsVerticalIcon className="h-5 w-5" />
      <span className="text-base">{`${slippage}%`}</span>
    </button>
  )
}

export default SlippageButton
