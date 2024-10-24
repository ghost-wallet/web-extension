import React, { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import TransactionList from '@/pages/Wallet/Transactions/TransactionList'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'
import useKasplex from '@/hooks/contexts/useKasplex'
import { Transaction } from '@/contexts/kasplex/kasplexReducer'

export default function Transactions() {
  const { loadKrc20Transactions } = useKasplex()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactionsOnMount = async () => {
      try {
        setInitialLoading(true)
        const response = await loadKrc20Transactions()
        setTransactions(response.result)
        setNextCursor(response.next)
        setError(null)
      } catch (error) {
        setError('Error loading transactions')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchTransactionsOnMount()
  }, [loadKrc20Transactions])

  const loadMoreTransactions = async () => {
    if (!nextCursor || loadingMore) return

    try {
      setLoadingMore(true)
      const response = await loadKrc20Transactions(undefined, nextCursor)
      setTransactions((prev) => [...prev, ...response.result])
      setNextCursor(response.next)
    } catch (error) {
      setError('Error loading more transactions')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Recent Activity" showBackButton={false} />

        {initialLoading ? (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : transactions.length > 0 ? (
          <TransactionList
            transactions={transactions}
            loadMore={loadMoreTransactions}
            loadingMore={loadingMore}
          />
        ) : (
          <p className="text-mutedtext mt-10 text-center">No recent activity found.</p>
        )}
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
