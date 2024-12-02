import React, { useRef } from 'react'
import Spinner from '@/components/loaders/Spinner'
import KaspaTxnItem from './KaspaTxnItem'
import { KaspaTransaction } from '@/utils/interfaces'
import { groupKaspaTransactionsByDate } from '@/utils/grouping'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'

interface KaspaTxnListProps {
  transactions: KaspaTransaction[]
  loadMore: () => void
  loadingMore: boolean
}

export default function KaspaTxnList({ transactions, loadMore, loadingMore }: KaspaTxnListProps) {
  const lastElementRef = useRef<HTMLLIElement | null>(null)
  const groupedTransactions = groupKaspaTransactionsByDate(transactions)

  useInfiniteScroll(loadingMore, loadMore, lastElementRef)

  return (
    <div className="pb-24">
      {/*TODO show ongoing kas swaps*/}

      <ul className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, transactions], dateIndex) => (
          <li key={date}>
            <p className="text-lg text-mutedtext mb-2">{date}</p>
            <ul className="space-y-3">
              {transactions.map((transaction, index) => (
                <KaspaTxnItem
                  key={transaction.transaction_id}
                  transaction={transaction}
                  ref={
                    dateIndex === Object.keys(groupedTransactions).length - 1 &&
                    index === transactions.length - 1
                      ? lastElementRef
                      : null
                  }
                  isLast={
                    dateIndex === Object.keys(groupedTransactions).length - 1 &&
                    index === transactions.length - 1
                  }
                />
              ))}
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
