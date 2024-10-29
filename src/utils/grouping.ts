import { KRC20Transaction } from '@/utils/interfaces'

export function groupConsecutiveMints(transactions: KRC20Transaction[]): KRC20Transaction[] {
  const groupedTransactions: KRC20Transaction[] = []
  let currentGroup: KRC20Transaction[] = []

  const addGroupedTransaction = () => {
    if (currentGroup.length > 0) {
      const totalAmount = currentGroup.reduce((sum, t) => sum + parseInt(t.amt, 10), 0).toString()
      groupedTransactions.push({
        ...currentGroup[0],
        amt: totalAmount,
        groupedOperations: [...currentGroup],
      })
    }
  }

  transactions.forEach((transaction) => {
    if (currentGroup.length > 0 && transaction.op === 'mint' && transaction.tick === currentGroup[0].tick) {
      currentGroup.push(transaction)
    } else {
      addGroupedTransaction() // Add previous group if exists
      currentGroup = [transaction]
    }
  })

  // Add the last group if any
  addGroupedTransaction()

  return groupedTransactions
}

export const groupTransactionsByDate = (
  transactions: KRC20Transaction[],
): { [date: string]: KRC20Transaction[] } => {
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
    {} as { [date: string]: KRC20Transaction[] },
  )
}
