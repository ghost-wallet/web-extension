import { fetchFromCoinGecko } from './coingecko/fetchFromCoinGecko'
import { fetchFromKaspaApi } from './kaspa/fetchFromKaspaApi'
import { useQuery } from '@tanstack/react-query'

export default function useKaspaPrice(currency: string) {
  const fetchPrice = async () => {
    try {
      // Try fetching from CoinGecko API
      return await fetchFromCoinGecko(currency)
    } catch (error) {
      console.error('Failed to fetch from CoinGecko, falling back to Kaspa API.', error)

      // Fallback to Kaspa API if CoinGecko fails
      try {
        return await fetchFromKaspaApi()
      } catch (kaspaError) {
        console.error('Error fetching price from Kaspa API:', kaspaError)
      }
    }
  }

  return useQuery({
    queryKey: ['kaspaPrice', currency],
    queryFn: fetchPrice,
    staleTime: 60_000, // 1 min
    refetchInterval: 60_000,
  })
}
