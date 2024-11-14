import React from 'react'
import { ArrowsRightLeftIcon, ArrowDownIcon, BoltIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface TransactionIconProps {
  operationType: string
}

const TransactionIcon: React.FC<TransactionIconProps> = ({ operationType }) => {
  const getIcon = () => {
    switch (operationType) {
      case 'Swapped':
        return <ArrowsRightLeftIcon className="w-4 h-4 text-black" strokeWidth={2} />
      case 'Minted':
        return <BoltIcon className="w-4 h-4 text-black" strokeWidth={2} />
      case 'Sent':
        return <PaperAirplaneIcon className="w-4 h-4 text-black" strokeWidth={2} />
      case 'Received':
        return <ArrowDownIcon className="w-4 h-4 text-black" strokeWidth={2} />
      default:
        return null
    }
  }

  return <>{getIcon()}</>
}

export default TransactionIcon
