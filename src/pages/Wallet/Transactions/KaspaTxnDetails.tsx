import React from 'react'
import { useLocation } from 'react-router-dom'
import TransactionIconDisplay from '@/pages/Wallet/Transactions/TransactionIconDisplay'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'
import TableSection from '@/components/table/TableSection'
import { getKaspaExplorerTxsUrl, getKasFyiTransactionUrl } from '@/utils/transactions'
import { formatTransactionDateAndTime } from '@/utils/grouping'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'
import TopNav from '@/components/navigation/TopNav'
import BottomNav from '@/components/navigation/BottomNav'
import useSettings from '@/hooks/contexts/useSettings'
import { KAS_TICKER } from '@/utils/constants/tickers'

export default function KaspaTxnDetails() {
  const { settings } = useSettings()
  const networkAddress = settings.nodes[settings.selectedNode].address

  const location = useLocation()
  const { transaction, amount, isReceived } = location.state || {}

  return (
    <>
      <TopNav />
      <AnimatedMain>
        <Header title={isReceived ? 'Received' : 'Sent'} showBackButton={true} />
        <div className="flex flex-col items-center justify-center px-4 pb-4">
          <TransactionIconDisplay
            ticker={KAS_TICKER}
            operationType={isReceived ? 'Received' : 'Sent'}
            size="large"
          />
          <TransactionAmountDisplay
            amt={amount}
            tick={KAS_TICKER}
            isMint={false}
            isReceived={isReceived}
            className="pt-4 text-3xl"
          />
        </div>
        <div className="px-4">
          <TableSection
            rows={[
              {
                label: 'Status',
                value: (
                  <span className={transaction.is_accepted ? 'text-success' : 'text-error'}>
                    {transaction.is_accepted ? 'Succeeded' : 'Failed'}
                  </span>
                ),
              },
              { label: 'Date', value: formatTransactionDateAndTime(transaction.block_time) },
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
                label: 'Txn ID',
                value: <TruncatedCopyAddress address={transaction.transaction_id} />,
              },
              {
                label: '',
                value: (
                  <a
                    href={getKaspaExplorerTxsUrl(transaction.transaction_id)}
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
                          href={getKasFyiTransactionUrl(transaction.transaction_id)}
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
