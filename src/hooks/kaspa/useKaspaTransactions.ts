import { fetchKaspaTransactionHistory } from '@/hooks/kaspa/fetchKaspaTransactionHistory'
import { KaspaTransactionList } from '@/utils/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

interface FetchKaspaTransactionsParams {
  address: string
}

type KaspaTransactionQueryKey = [string, FetchKaspaTransactionsParams]

const KASPA_HISTORY_TRANSACTIONS_PER_PAGE = 25 as const

function kaspaTransactionsqueryFn({
  queryKey,
  pageParam,
}: {
  queryKey: [string, FetchKaspaTransactionsParams]
  pageParam: number | null
}) {
  const [_key, { address }] = queryKey
  return fetchKaspaTransactionHistory(address, KASPA_HISTORY_TRANSACTIONS_PER_PAGE, pageParam)
}

export function useKaspaTransactions() {
  const { kaspa } = useKaspa()

  return useInfiniteQuery<
    KaspaTransactionList,
    Error,
    InfiniteData<KaspaTransactionList>,
    KaspaTransactionQueryKey,
    number | null
  >({
    queryKey: ['kaspaTransactions', { address: kaspa.addresses[0] }],
    queryFn: kaspaTransactionsqueryFn,
    refetchInterval: 3000,
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage[lastPage.length - 1]?.block_time
    },
  })
}
