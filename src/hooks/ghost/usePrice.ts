import { fetchPrice } from './fetchPrice'
import { fetchPriceV2 } from './fetchPriceV2'
import { fetchFromCoinGecko } from '../coingecko/fetchFromCoinGecko'
import { fetchFromKaspaApi } from '@/hooks/kaspa/fetchFromKaspaApi'
import { useQuery } from '@tanstack/react-query'
import useSettings from '@/hooks/contexts/useSettings'

export function useKaspaPrice() {
  const { settings } = useSettings()
  const ticker = 'KAS'
  const name = 'Kaspa'

  return useQuery({
    queryKey: ['kaspaPrice', settings.currency],
    queryFn: async () => {
      try {
        return await fetchPriceV2(settings.currency, ticker, name)
      } catch (error) {
        try {
          return await fetchPrice(settings.currency, ticker, name)
        } catch (error) {
          try {
            console.error('Failed to fetch price from Ghost API, falling back to CoinGecko:', error)
            return await fetchFromCoinGecko(settings.currency, name)
          } catch (error) {
            if (settings.currency === 'USD') {
              return fetchFromKaspaApi()
            }
          }
        }
      }
    },
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000, // 30 seconds
    retry: 5,
  })
}

export function useTetherPrice() {
  const { settings } = useSettings()
  const ticker = 'USDT'
  const name = 'Tether'

  return useQuery({
    queryKey: ['tetherPrice', settings.currency],
    queryFn: async () => {
      try {
        return await fetchPriceV2(settings.currency, ticker, name)
      } catch (error) {
        try {
          return await fetchPrice(settings.currency, ticker, name)
        } catch (error) {
          try {
            console.error('Failed to fetch price from Ghost API, falling back to CoinGecko:', error)
            return await fetchFromCoinGecko(settings.currency, name)
          } catch (error) {
            if (settings.currency === 'USD') {
              return 1.0
            }
          }
        }
      }
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
    refetchInterval: 60 * 60 * 1000, // 60 minutes
    retry: 5,
  })
}
