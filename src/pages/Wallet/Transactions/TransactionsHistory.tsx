import React from 'react'
import TransactionList from '@/pages/Wallet/Transactions/TransactionList'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'
import { useKRC20Transactions } from '@/hooks/kasplex/useKRC20Transactions'

interface TransactionsHistoryProps {
  tick?: string
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({ tick }) => {
  const query = useKRC20Transactions(tick)

  const transactions = query.data ? query.data.pages.flatMap((page) => page.result) : []
  const error = query.error
  const loadingMore = query.isFetchingNextPage
  const initialLoading = query.isPending

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
      <p className="text-mutedtext mt-10 text-center  text-base">
        No recent activity found for KRC20 tokens.
      </p>
    )
  }

  return (
    <TransactionList transactions={transactions} loadMore={loadMoreTransactions} loadingMore={loadingMore} />
  )
}

export default TransactionsHistory
