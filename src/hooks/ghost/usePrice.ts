import { fetchPrice } from './fetchPrice'
import { fetchFromCoinGecko } from '../coingecko/fetchFromCoinGecko'
import { fetchFromKaspaApi } from '@/hooks/kaspa/fetchFromKaspaApi'
import { useQuery } from '@tanstack/react-query'
import useSettings from '@/hooks/contexts/useSettings'

export function useKaspaPrice(ticker: string = 'KAS', name: string = 'Kaspa') {
  const { settings, updateSetting } = useSettings()

  return useQuery({
    queryKey: ['kaspaPrice', settings.currency],
    queryFn: async () => {
      try {
        return await fetchPrice(settings.currency, ticker, name)
      } catch (error) {
        console.error('Failed to fetch price from Ghost API, falling back to CoinGecko:', error)
        try {
          return await fetchFromCoinGecko(settings.currency, name)
        } catch (coingeckoError) {
          console.error('Failed to fetch price from CoinGecko, falling back to Kaspa API:', coingeckoError)
          // Default to USD
          updateSetting('currency', 'USD')
          return await fetchFromKaspaApi()
        }
      }
    },
    staleTime: 10_000, // 10 seconds
    refetchInterval: 10_000, // 10 seconds
    retry: 5,
  })
}

export function useTetherPrice(ticker: string = 'USDT', name: string = 'Tether') {
  const { settings, updateSetting } = useSettings()

  return useQuery({
    queryKey: ['tetherPrice', settings.currency],
    queryFn: async () => {
      try {
        return await fetchPrice(settings.currency, ticker, name)
      } catch (error) {
        console.error('Failed to fetch price from Ghost API, falling back to CoinGecko:', error)
        try {
          return await fetchFromCoinGecko(settings.currency, name)
        } catch (coingeckoError) {
          console.error('Failed to fetch price from CoinGecko, falling back to Kaspa API:', coingeckoError)
          // Default to USD and set Tether price to 1.0
          updateSetting('currency', 'USD')
          return 1.0
        }
      }
    },
    staleTime: 300_000, // 5 minutes
    refetchInterval: 300_000, // 5 minutes
    retry: 5,
  })
}
