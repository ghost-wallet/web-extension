import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TransactionIconDisplay from '@/pages/Wallet/Transactions/TransactionIconDisplay'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import { KRC20Transaction } from '@/types/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import { getOperationDetails, getTransactionStatusText } from '@/utils/transactions'

interface TransactionItemProps {
  operation: KRC20Transaction
  isLast: boolean
  ref?: React.Ref<HTMLLIElement>
}

const KRC20TxnItem = forwardRef<HTMLLIElement, TransactionItemProps>(({ operation }, ref) => {
  const navigate = useNavigate()
  const { kaspa } = useKaspa()
  const address = kaspa.addresses[0]
  const { op, amt, tick, opAccept } = operation
  const { operationType, isMint, isReceived, isSwappedTo, isSwappedFrom } = getOperationDetails(
    operation,
    address,
  )

  const handleClick = () => {
    navigate(`/transactions/krc20/details`, {
      state: {
        operation,
        operationType,
        isMint,
        isReceived,
        isSwappedTo,
        isSwappedFrom,
        address,
      },
    })
  }

  return (
    <li
      ref={ref}
      className="flex items-center justify-between p-4 bg-darkmuted hover:bg-slightmuted rounded-lg shadow-md cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <TransactionIconDisplay ticker={tick} operationType={operationType} size="small" />
        <div className="ml-4">
          <p className="text-base text-mutedtext">{getTransactionStatusText(operationType, opAccept, op)}</p>
        </div>
      </div>
      {opAccept === '1' && (
        <TransactionAmountDisplay
          amt={amt}
          tick={tick}
          isMint={isMint}
          isReceived={isReceived || isSwappedFrom}
          className="text-base"
        />
      )}
    </li>
  )
})

export default KRC20TxnItem
