import React, { useEffect, useRef } from 'react'
import TransactionItem from './TransactionItem'
import Spinner from '@/components/Spinner'
import { KRC20Transaction } from '@/utils/interfaces'
import { groupConsecutiveMints, groupTransactionsByDate } from '@/utils/grouping'

interface TransactionListProps {
  transactions: KRC20Transaction[]
  loadMore: () => void
  loadingMore: boolean
}

export default function TransactionList({ transactions, loadMore, loadingMore }: TransactionListProps) {
  const lastElementRef = useRef<HTMLLIElement | null>(null)

  // TODO: fix mint ops being grouped with transfer ops on click
  const groupedTransactions = groupTransactionsByDate(groupConsecutiveMints(transactions))

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const lastEntry = entries[0]
        if (lastEntry.isIntersecting && !loadingMore) {
          loadMore()
        }
      },
      { threshold: 1.0 },
    )

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current)
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current)
      }
    }
  }, [loadingMore, loadMore])

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
                  <TransactionItem
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
