import { fetchKaspaTransactionHistory } from '@/hooks/kaspa/fetchKaspaTransactionHistory'
import { KaspaTransactionList } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

interface FetchKaspaTransactionsParams {
  address: string
  limit: number
  offset: number
}

function kaspaTransactionsqueryFn({
  queryKey,
  pageParam,
}: {
  queryKey: KaspaTransactionQueryKey
  pageParam: number
}) {
  const [_key, { address, limit }] = queryKey
  const offset = pageParam ?? 0
  return fetchKaspaTransactionHistory(address, limit, offset)
}

type KaspaTransactionQueryKey = [string, Omit<FetchKaspaTransactionsParams, 'offset'>]

export function useKaspaTransactions() {
  const { kaspa } = useKaspa()

  return useInfiniteQuery<
    KaspaTransactionList,
    Error,
    InfiniteData<KaspaTransactionList>,
    KaspaTransactionQueryKey,
    number
  >({
    queryKey: [
      'kaspaTransactions',
      { address: kaspa.addresses[0], limit: 50 },
    ],
    queryFn: kaspaTransactionsqueryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const limit = 25
      return allPages.length * limit
    },
  })
}
