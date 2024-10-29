import React from 'react'
import { ArrowDownIcon, BoltIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface TransactionIconProps {
  operationType: string
}

const TransactionIcon: React.FC<TransactionIconProps> = ({ operationType }) => {
  const getIcon = () => {
    switch (operationType) {
      case 'mint':
        return <BoltIcon className="w-4 h-4 text-black" strokeWidth={2} />
      case 'transfer':
        return <ArrowDownIcon className="w-4 h-4 text-black" strokeWidth={2} />
      case 'send':
        return <PaperAirplaneIcon className="w-4 h-4 text-black" strokeWidth={2} />
      default:
        return null
    }
  }

  return <>{getIcon()}</>
}

export default TransactionIcon
