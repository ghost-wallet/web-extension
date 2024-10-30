import { fetchKRC20TransactionHistory } from '@/hooks/kasplex/fetchKrc20TransactionHistory'
import { KRC20TransactionList } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import useSettings from '@/hooks/contexts/useSettings'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

interface FetchKRC20TransactionsParams {
  selectedNode: number
  address: string
  tick?: string
}

function krc20TransactionsqueryFn({
  queryKey,
  pageParam,
}: {
  queryKey: KRC20TransactionQueryKey
  pageParam: string | null
}) {
  const [_key, { selectedNode, address, tick }] = queryKey
  return fetchKRC20TransactionHistory(selectedNode, address, pageParam, tick)
}

type KRC20TransactionQueryKey = [string, FetchKRC20TransactionsParams]

export function useKRC20Transactions(tick?: string) {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()

  return useInfiniteQuery<
    KRC20TransactionList,
    Error,
    InfiniteData<KRC20TransactionList>,
    KRC20TransactionQueryKey,
    string | null
  >({
    queryKey: [
      'krc20Transactions',
      { selectedNode: settings.selectedNode, address: kaspa.addresses[0], tick },
    ],
    queryFn: krc20TransactionsqueryFn,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next,
  })
}
