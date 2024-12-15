import { fetchKasFyiMarketData } from '@/hooks/kas-fyi/fetchMarketData'
import { useQuery } from '@tanstack/react-query'

export function useRanks(symbols: string[]) {
  return useQuery({
    queryKey: ['kasFyiRanks', symbols],
    queryFn: async () => {
      const data = await fetchKasFyiMarketData(symbols)
      return data.results.reduce(
        (map, token) => {
          map[token.ticker] = { rank: token.rank }
          return map
        },
        {} as Record<string, { rank: number }>,
      )
    },
    staleTime: 300_000, // 5 minutes
    refetchInterval: 300_000, // 5 minutes
    retry: 5,
  })
}
