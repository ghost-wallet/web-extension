import React, { useEffect, useRef, useState } from 'react'
import TransactionItem from './TransactionItem'
import Spinner from '@/components/Spinner'
import useKasplex from '@/hooks/useKasplex'

interface Operation {
  mtsAdd: string
  op: string
  amt: string
  tick: string
  hashRev: string
}

// Utility function to group transactions by date
const groupTransactionsByDate = (transactions: Operation[]): { [date: string]: Operation[] } => {
  return transactions.reduce(
    (groups, transaction) => {
      const date = new Date(parseInt(transaction.mtsAdd)).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as { [date: string]: Operation[] },
  )
}

export default function TransactionList() {
  const { kasplex, loadOperations } = useKasplex()
  const [loadingMore, setLoadingMore] = useState(false)
  const lastElementRef = useRef<HTMLLIElement | null>(null)

  // Group transactions by date
  const groupedTransactions = groupTransactionsByDate(kasplex.operations.result)

  // Observer for automatic "Load More" functionality
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const lastEntry = entries[0]
        if (lastEntry.isIntersecting && kasplex.operations.next && !loadingMore) {
          setLoadingMore(true)
          try {
            await loadOperations(undefined, kasplex.operations.next)
          } catch (err) {
            console.error('Error loading more operations:', err)
          } finally {
            setLoadingMore(false)
          }
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
  }, [kasplex.operations.next, loadingMore, loadOperations])

  return (
    <div className="pt-6 px-4 pb-24">
      <ul className="space-y-6">
        {Object.entries(groupedTransactions).map(([date, transactions], groupIndex) => (
          <li key={date}>
            <p className="text-lg font-lato text-mutedtext mb-2">{date}</p>
            <ul className="space-y-3">
              {transactions.map((transaction, index) => {
                const isLastElement =
                  groupIndex === Object.keys(groupedTransactions).length - 1 &&
                  index === transactions.length - 1
                return (
                  <TransactionItem
                    key={transaction.hashRev}
                    operation={transaction}
                    ref={isLastElement ? lastElementRef : null} // Assign the ref to the last element across all groups
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
