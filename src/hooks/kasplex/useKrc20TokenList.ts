import { useQuery } from '@tanstack/react-query'
import { fetchKrc20TokenList } from '@/hooks/kasplex/fetchKrc20TokenList'
import useSettings from '@/hooks/contexts/useSettings'

interface FetchKRC20TokenListParams {
  selectedNode: number
}

function krc20TokenListQueryFn({ queryKey }: { queryKey: [string, FetchKRC20TokenListParams] }) {
  const [_key, { selectedNode }] = queryKey
  return fetchKrc20TokenList(selectedNode)
}

export const useKrc20TokenList = () => {
  const { settings } = useSettings()
  const selectedNetwork = settings.nodes[settings.selectedNode].address

  return useQuery({
    queryKey: ['krc20TokenListQuery', { selectedNode: settings.selectedNode }],
    queryFn: krc20TokenListQueryFn,
    staleTime: 300_000, // 5 minutes
    refetchInterval: 300_000,
    enabled: selectedNetwork === 'mainnet' || selectedNetwork === 'testnet-10',
  })
}
