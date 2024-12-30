import { fetchKRC20TransactionHistory } from '@/hooks/kasplex/fetchKrc20TransactionHistory'
import { KRC20TransactionList } from '@/types/interfaces'
import useKaspa from '@/hooks/contexts/useKaspa'
import useSettings from '@/hooks/contexts/useSettings'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

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
  const selectedNetwork = settings.nodes[settings.selectedNode].address

  const isQueryEnabled = useMemo(() => {
    if (!(kaspa.addresses.length > 0)) return false
    const address = kaspa.addresses[0]
    if (kaspa.connected && selectedNetwork === 'mainnet' && address.startsWith('kaspa:')) {
      return true
    }
    return kaspa.connected && selectedNetwork === 'testnet-10' && address.startsWith('kaspatest:')
  }, [kaspa.addresses, kaspa.connected, settings.selectedNode])

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
    enabled: isQueryEnabled,
    refetchInterval: 3000,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.next,
  })
}
