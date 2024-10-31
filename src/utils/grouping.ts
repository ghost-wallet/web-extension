import { KRC20Transaction } from '@/utils/interfaces'

export const groupTransactionsByDate = (
  transactions: KRC20Transaction[],
): { [date: string]: KRC20Transaction[] } => {
  return transactions.reduce(
    (groups, transaction) => {
      const date = formatTransactionDate(transaction.mtsAdd)

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as { [date: string]: KRC20Transaction[] },
  )
}

export const formatTransactionDate = (timestamp: string): string => {
  return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
