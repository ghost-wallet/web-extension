import React from 'react'
import { useLocation } from 'react-router-dom'
import TransactionIconDisplay from '@/pages/Wallet/Transactions/TransactionIconDisplay'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import TableSection from '@/components/table/TableSection'
import { getKaspaExplorerUrl } from '@/utils/transactions'
import { formatTransactionDateAndTime } from '@/utils/grouping'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'

export default function KaspaTxnDetails() {
  const location = useLocation()

  const { transaction, amount, isReceived } = location.state || {}
  console.log('transaction', transaction)
  return (
    <AnimatedMain>
      <Header title={isReceived ? 'Received' : 'Sent'} showBackButton={true} />
      <div className="flex flex-col items-center justify-center p-4">
        <TransactionIconDisplay
          ticker={'KAS'}
          operationType={isReceived ? 'Received' : 'Sent'}
          size="large"
        />
        <TransactionAmountDisplay
          amt={amount}
          tick={'KAS'}
          isMint={false}
          isReceived={isReceived}
          className="mt-6 text-3xl"
        />
      </div>
      <div className="p-4">
        <TableSection
          rows={[
            { label: 'Date', value: formatTransactionDateAndTime(transaction.block_time) },
            {
              label: 'Status',
              value: (
                <span className={transaction.is_accepted ? 'text-success' : 'text-error'}>
                  {transaction.is_accepted ? 'Succeeded' : 'Failed'}
                </span>
              ),
            },
            ...(transaction.outputs[1]?.script_public_key_address
              ? [
                  {
                    label: 'From',
                    value: (
                      <TruncatedCopyAddress address={transaction.outputs[1].script_public_key_address} />
                    ),
                  },
                ]
              : []),
            {
              label: 'To',
              value: <TruncatedCopyAddress address={transaction.outputs[0].script_public_key_address} />,
            },
            {
              label: '',
              value: (
                <a
                  href={getKaspaExplorerUrl(transaction.transaction_id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Kaspa Explorer
                </a>
              ),
              isFullWidth: true,
            },
          ]}
        />
      </div>
    </AnimatedMain>
  )
}
