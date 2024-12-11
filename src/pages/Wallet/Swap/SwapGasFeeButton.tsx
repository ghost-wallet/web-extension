import React from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { formatGasFee } from '@/utils/formatting'

interface SwapGasFeeButtonProps {
  setIsGasFeeOpen: (open: boolean) => void
  gasFee: string
}

const SwapGasFeeButton: React.FC<SwapGasFeeButtonProps> = ({ setIsGasFeeOpen, gasFee }) => {
  return (
    <button
      onClick={() => setIsGasFeeOpen(true)}
      className="flex items-center space-x-1 text-mutedtext hover:text-primarytext py-2"
    >
      <span className="text-base">Gas Fee: {`${formatGasFee(gasFee)} KAS`}</span>
      <PencilSquareIcon className="h-5 w-5" />
    </button>
  )
}

export default SwapGasFeeButton
