import React, { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import TransactionList from '@/pages/Wallet/Transactions/TransactionList'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'
import { fetchKRC20TransactionHistory } from '@/hooks/kasplex/fetchKrc20TransactionHistory'
import { KRC20Transaction, KRC20TransactionList } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import useSettings from '@/hooks/contexts/useSettings'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

interface FetchKRC20TransactionsParams {
  selectedNode: number
  address: string
}

type KRC20TransactionQueryKey = [string, FetchKRC20TransactionsParams]

function krc20TransactionsqueryFn({
  queryKey,
  pageParam,
}: {
  queryKey: KRC20TransactionQueryKey
  pageParam: string | null
}) {
  const [_key, { selectedNode, address }] = queryKey
  return fetchKRC20TransactionHistory(selectedNode, address, pageParam)
}

export default function Transactions() {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()

  const query = useInfiniteQuery<
    KRC20TransactionList,
    Error,
    InfiniteData<KRC20TransactionList>,
    KRC20TransactionQueryKey,
    string | null
  >({
    queryKey: ['krc20Transactions', { selectedNode: settings.selectedNode, address: kaspa.addresses[0] }],
    queryFn: krc20TransactionsqueryFn,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next,
  })

  const transactions = query.data ? query.data.pages.flatMap((page) => page.result) : []
  const error = query.error
  const loadingMore = query.isFetchingNextPage
  const initialLoading = query.isPending

  const loadMoreTransactions = () => {
    query.fetchNextPage()
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
          <ErrorMessage message={error.message} />
        ) : transactions && transactions.length > 0 ? (
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
