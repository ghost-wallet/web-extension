import { fetchKasPrice } from '../ghost/fetchKasPrice'
import { fetchFromCoinGecko } from '../coingecko/fetchFromCoinGecko'
import { useQuery } from '@tanstack/react-query'

export default function useKaspaPrice(currency: string) {
  return useQuery({
    queryKey: ['kaspaPrice', currency],
    queryFn: async () => {
      try {
        return await fetchKasPrice(currency)
      } catch (error) {
        console.error('Failed to fetch price from Ghost API, falling back to CoinGecko:', error)
        return await fetchFromCoinGecko(currency)
      }
    },
    staleTime: 5_000, // 5 seconds
    refetchInterval: 5_000, // 5 seconds
    retry: 5,
  })
}
