import React from 'react'
import { useKaspaTransactions } from '@/hooks/kaspa/useKaspaTransactions'
import ErrorMessage from '@/components/messages/ErrorMessage'
import KaspaTxnList from '@/pages/Wallet/Transactions/KaspaTxnList'
import { KaspaTransaction } from '@/utils/interfaces'
import TransactionsLoading from '@/pages/Wallet/Transactions/TransactionsLoading'
import ActiveChaingeOrders from '@/pages/Wallet/Transactions/ActiveChaingeOrders'

interface KaspaTxnHistoryProps {}

const KaspaTxnHistory: React.FC<KaspaTxnHistoryProps> = () => {
  const query = useKaspaTransactions()
  const transactions = query.data ? query.data.pages.flatMap((page) => page) : []
  const error = query.error
  const loadingMore = query.isFetchingNextPage
  const initialLoading = query.isPending

  const loadMoreTransactions = () => {
    query.fetchNextPage()
  }

  if (initialLoading) {
    return <TransactionsLoading />
  }

  if (error) {
    return <ErrorMessage message={error.message} className="h-6 mb-4 mt-2 flex justify-center items-center" />
  }

  if (transactions.length === 0) {
    return <p className="text-mutedtext mt-10 text-center text-base">No recent activity for Kaspa.</p>
  }

  return (
    <>
      <ActiveChaingeOrders tickerFilter="KAS" />
      <KaspaTxnList
        transactions={transactions as KaspaTransaction[]}
        loadMore={loadMoreTransactions}
        loadingMore={loadingMore}
      />
    </>
  )
}

export default KaspaTxnHistory
