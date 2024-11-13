import React from 'react'
import { PencilSquareIcon } from '@heroicons/react/24/outline'

interface SwapNetworkFeeButtonProps {
  setIsNetworkFeeOpen: (open: boolean) => void
  networkFee: string
}

const SwapNetworkFeeButton: React.FC<SwapNetworkFeeButtonProps> = ({ setIsNetworkFeeOpen, networkFee }) => {
  return (
    <button
      onClick={() => setIsNetworkFeeOpen(true)}
      className="flex items-center space-x-1 text-mutedtext hover:text-primarytext py-2"
    >
      <span className="text-base">Network Fee: {`${networkFee} KAS`}</span>
      <PencilSquareIcon className="h-5 w-5" />
    </button>
  )
}

export default SwapNetworkFeeButton
