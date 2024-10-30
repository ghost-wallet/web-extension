import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import CryptoImage from '@/components/CryptoImage'
import TransactionIcon from '@/pages/Wallet/Transactions/TransactionIcon'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import { KRC20Transaction } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import { getOperationDetails } from '@/utils/transactions'

interface TransactionItemProps {
  operation: KRC20Transaction
  isLast: boolean
  ref?: React.Ref<HTMLLIElement>
}

const TransactionItem = forwardRef<HTMLLIElement, TransactionItemProps>(({ operation }, ref) => {
  const navigate = useNavigate()
  const { kaspa } = useKaspa()
  const address = kaspa.addresses[0]
  const { amt, tick, groupedOperations } = operation
  const { operationType, isMint, isReceived } = getOperationDetails(operation, address)

  const handleClick = () => {
    navigate(`/transactions/txn-item`, { state: { groupedOperations, address } })
  }

  return (
    <li
      ref={ref}
      className="flex items-center justify-between p-4 bg-darkmuted rounded-lg shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <CryptoImage ticker={tick} size="small" />
          <div className="absolute -bottom-1 -right-1">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border border-darkmuted">
              <TransactionIcon operationType={operationType} />
            </div>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-base text-mutedtext">{operationType}</p>
        </div>
      </div>
      <TransactionAmountDisplay amt={amt} tick={tick} isMint={isMint} isReceived={isReceived} />
    </li>
  )
})

export default TransactionItem
