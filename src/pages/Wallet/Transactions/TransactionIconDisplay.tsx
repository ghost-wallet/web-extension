import React from 'react'
import CryptoImage from '@/components/CryptoImage'
import TransactionIcon from '@/pages/Wallet/Transactions/TransactionIcon'

interface TransactionIconDisplayProps {
  ticker: string
  operationType: string
  size?: 'small' | 'large'
}

const TransactionIconDisplay: React.FC<TransactionIconDisplayProps> = ({
  ticker,
  operationType,
  size = 'small',
}) => {
  return (
    <div className="relative">
      <CryptoImage ticker={ticker} size={size} />
      <div className="absolute -bottom-1 -right-1">
        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border border-darkmuted">
          <TransactionIcon operationType={operationType} />
        </div>
      </div>
    </div>
  )
}

export default TransactionIconDisplay
