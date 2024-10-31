import React from 'react'
import { useKaspaTransactions } from '@/hooks/kaspa/useKaspaTransactions'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'
import KaspaTxnList from '@/pages/Wallet/Transactions/KaspaTxnList'
import { KaspaTransaction } from '@/utils/interfaces'

interface KaspaTxnHistoryProps {}

const KaspaTxnHistory: React.FC<KaspaTxnHistoryProps> = () => {
  const query = useKaspaTransactions()
  console.log('KaspaTxnHistory query', query)

  const transactions = query.data
    ? query.data.pages.flatMap((page) => page.result || page)
    : []

  const error = query.error
  const loadingMore = query.isFetchingNextPage
  const initialLoading = query.isPending

  console.log('KaspaTxnHistory transactions', transactions)

  const loadMoreTransactions = () => {
    query.fetchNextPage()
  }

  if (initialLoading) {
    return (
      <div className="mt-10 flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  if (transactions.length === 0) {
    return (
      <p className="text-mutedtext mt-10 text-center text-base">No recent activity found for KRC20 tokens.</p>
    )
  }

  return (
    <KaspaTxnList
      transactions={transactions as KaspaTransaction[]}
      loadMore={loadMoreTransactions}
      loadingMore={loadingMore}
    />
  )
}

export default KaspaTxnHistory
