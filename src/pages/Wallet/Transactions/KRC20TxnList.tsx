import React, { useRef } from 'react'
import KRC20TxnItem from './KRC20TxnItem'
import Spinner from '@/components/Spinner'
import { KRC20Transaction } from '@/utils/interfaces'
import { groupKRC20TransactionsByDate } from '@/utils/grouping'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

interface TransactionListProps {
  transactions: KRC20Transaction[]
  loadMore: () => void
  loadingMore: boolean
}

export default function KRC20TxnList({ transactions, loadMore, loadingMore }: TransactionListProps) {
  const lastElementRef = useRef<HTMLLIElement | null>(null)
  const groupedTransactions = groupKRC20TransactionsByDate(transactions)

  useInfiniteScroll(loadingMore, loadMore, lastElementRef)

  return (
    <div className="pb-24">
      <ul className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, transactions], groupIndex) => (
          <li key={date}>
            <p className="text-lg text-mutedtext mb-2">{date}</p>
            <ul className="space-y-3">
              {transactions.map((transaction, index) => {
                const isLastElement =
                  groupIndex === Object.keys(groupedTransactions).length - 1 &&
                  index === transactions.length - 1
                return (
                  <KRC20TxnItem
                    key={transaction.hashRev}
                    operation={transaction}
                    ref={isLastElement ? lastElementRef : null}
                    isLast={isLastElement}
                  />
                )
              })}
            </ul>
          </li>
        ))}
      </ul>

      {loadingMore && (
        <div className="flex justify-center mt-6 mb-20">
          <Spinner />
        </div>
      )}
    </div>
  )
}
