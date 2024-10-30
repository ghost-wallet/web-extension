import { useEffect, useState, useCallback } from 'react'
import { fetchKRC20TransactionHistory } from '@/hooks/kasplex/fetchKrc20TransactionHistory'
import { KRC20Transaction } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import useSettings from '@/hooks/contexts/useSettings'

export function useKRC20Transactions(tick?: string) {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const [transactions, setTransactions] = useState<KRC20Transaction[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setInitialLoading(true)
        const response = await fetchKRC20TransactionHistory(
          settings.selectedNode,
          kaspa.addresses[0],
          nextCursor,
          tick, // Pass tick as an argument
        )
        setTransactions(response.result)
        setNextCursor(response.next)
        setError(null)
      } catch (error) {
        setError('Error loading transactions')
      } finally {
        setInitialLoading(false)
      }
    }
    fetchTransactions()
  }, [kaspa.addresses, settings.selectedNode, tick])

  const loadMoreTransactions = useCallback(async () => {
    if (!nextCursor || loadingMore) return
    try {
      setLoadingMore(true)
      const response = await fetchKRC20TransactionHistory(
        settings.selectedNode,
        kaspa.addresses[0],
        nextCursor,
        tick, // Pass tick as an argument
      )
      setTransactions((prev) => [...prev, ...response.result])
      setNextCursor(response.next)
    } catch (error) {
      setError('Error loading more transactions')
    } finally {
      setLoadingMore(false)
    }
  }, [nextCursor, loadingMore, settings.selectedNode, kaspa.addresses, tick])

  return { transactions, initialLoading, loadingMore, error, loadMoreTransactions }
}
