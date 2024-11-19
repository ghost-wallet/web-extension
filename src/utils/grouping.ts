import { KRC20Transaction } from '@/utils/interfaces'

export const groupKRC20TransactionsByDate = (
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

export const groupKaspaTransactionsByDate = (
  transactions: { block_time: number; transaction_id: string; outputs: any[] }[],
): { [date: string]: { block_time: number; transaction_id: string; outputs: any[] }[] } => {
  return transactions.reduce(
    (groups, transaction) => {
      const date = formatTransactionDate(transaction.block_time.toString())

      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    },
    {} as { [date: string]: { block_time: number; transaction_id: string; outputs: any[] }[] },
  )
}

export const formatTransactionDate = (timestamp: string): string => {
  return new Date(parseInt(timestamp)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatTransactionDateAndTime = (timestamp: string): string => {
  return new Date(parseInt(timestamp)).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  })
}
