import React from 'react'
import { useLocation } from 'react-router-dom'
import TransactionIconDisplay from '@/pages/Wallet/Transactions/TransactionIconDisplay'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import TableSection from '@/components/table/TableSection'
import {
  getKasFyiTransactionUrl,
  getKaspaExplorerTxsUrl,
  getTransactionStatusText,
} from '@/utils/transactions'
import { formatTransactionDateAndTime } from '@/utils/grouping'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'
import TopNav from '@/components/navigation/TopNav'
import BottomNav from '@/components/navigation/BottomNav'
import useSettings from '@/hooks/contexts/useSettings'

export default function KRC20TxnDetails() {
  const { settings } = useSettings()
  const networkAddress = settings.nodes[settings.selectedNode].address
  const location = useLocation()
  const { operation, operationType, isMint, isReceived } = location.state || {}
  const { op, amt, hashRev, tick, mtsAdd, from, to, opAccept } = operation

  if (!tick || !hashRev || !operationType) {
    return <p className="text-center text-base text-mutedtext">No transaction details available.</p>
  }

  return (
    <>
      <TopNav />
      <AnimatedMain>
        <Header title={getTransactionStatusText(operationType, opAccept, op)} showBackButton={true} />
        <div className="flex flex-col items-center justify-center px-4 pb-4">
          <TransactionIconDisplay ticker={tick} operationType={operationType} size="large" />
          {opAccept === '1' && (
            <TransactionAmountDisplay
              amt={amt}
              tick={tick}
              isMint={isMint}
              isReceived={isReceived}
              className="pt-4 text-3xl"
            />
          )}
        </div>
        <div className="px-4">
          <TableSection
            rows={[
              {
                label: 'Status',
                value: (
                  <span className={opAccept === '1' ? 'text-success' : 'text-error'}>
                    {opAccept === '1' ? 'Succeeded' : 'Failed'}
                  </span>
                ),
              },
              { label: 'Date', value: formatTransactionDateAndTime(mtsAdd) },
              { label: 'From', value: <TruncatedCopyAddress address={from} /> },
              { label: 'To', value: <TruncatedCopyAddress address={to} /> },
              { label: 'Txn ID', value: <TruncatedCopyAddress address={hashRev} /> },
              {
                label: '',
                value: (
                  <a
                    href={getKaspaExplorerTxsUrl(hashRev)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View on Kaspa Explorer
                  </a>
                ),
                isFullWidth: true,
              },
              ...(networkAddress === 'mainnet'
                ? [
                    {
                      label: '',
                      value: (
                        <a
                          href={getKasFyiTransactionUrl(hashRev)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View on Kas.Fyi
                        </a>
                      ),
                      isFullWidth: true,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
