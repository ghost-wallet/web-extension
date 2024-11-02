import React from 'react'
import { useLocation } from 'react-router-dom'
import TransactionIconDisplay from '@/pages/Wallet/Transactions/TransactionIconDisplay'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import TableSection from '@/components/table/TableSection'
import { getKaspaExplorerUrl, getTransactionStatusText } from '@/utils/transactions'
import { formatTransactionDateAndTime } from '@/utils/grouping'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'

export default function KRC20TxnDetails() {
  const location = useLocation()
  const { operation, operationType, isMint, isReceived } = location.state || {}
  const { op, amt, hashRev, tick, mtsAdd, from, to, opAccept } = operation

  if (!tick || !hashRev || !operationType) {
    return <p className="text-center text-base text-mutedtext">No transaction details available.</p>
  }

  return (
    <AnimatedMain>
      <Header title={getTransactionStatusText(operationType, opAccept, op)} showBackButton={true} />
      <div className="flex flex-col items-center justify-center p-4">
        <TransactionIconDisplay ticker={tick} operationType={operationType} size="large" />
        {opAccept === '1' && (
          <TransactionAmountDisplay
            amt={amt}
            tick={tick}
            isMint={isMint}
            isReceived={isReceived}
            className="mt-6 text-3xl"
          />
        )}
      </div>
      <div className="p-4">
        <TableSection
          rows={[
            { label: 'Date', value: formatTransactionDateAndTime(mtsAdd) },
            {
              label: 'Status',
              value: (
                <span className={opAccept === '1' ? 'text-success' : 'text-error'}>
                  {opAccept === '1' ? 'Succeeded' : 'Failed'}
                </span>
              ),
            },
            { label: 'From', value: <TruncatedCopyAddress address={from} /> },
            { label: 'To', value: <TruncatedCopyAddress address={to} /> },
            {
              label: '',
              value: (
                <a
                  href={getKaspaExplorerUrl(hashRev)}
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
