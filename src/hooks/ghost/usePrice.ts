import { fetchPrice } from './fetchPrice'
import { fetchPriceV2 } from './fetchPriceV2'
import { fetchFromCoinGecko } from '../coingecko/fetchFromCoinGecko'
import { fetchFromKaspaApi } from '@/hooks/kaspa/fetchFromKaspaApi'
import { useQuery } from '@tanstack/react-query'
import useSettings from '@/hooks/contexts/useSettings'
import { KAS_TICKER, USDT_TICKER } from '@/utils/constants/tickers'

const KAS_NAME = 'Kaspa'
const USDT_NAME = 'Tether'

export function usePrices() {
  const { settings } = useSettings()
  const tickers = `${KAS_TICKER},${USDT_TICKER}`
  const names = `${KAS_NAME},${USDT_NAME}`

  return useQuery({
    queryKey: ['cryptoPrices', settings.currency],
    queryFn: async () => {
      try {
        const prices = await fetchPriceV2(settings.currency, tickers, names)
        return { kaspa: prices[0], tether: prices[1] } //TODO use correct api response structure
      } catch (error) {
        // TODO fallback to Coingecko first, then v1 lambda API next
        console.error('Failed to fetch prices from fetchPriceV2, falling back to V1 APIs:', error)

        const kaspaPrice = useKaspaPrice()
        const tetherPrice = useTetherPrice()

        return { kaspa: kaspaPrice, tether: tetherPrice }
      }
    },
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000, // 30 seconds
    retry: 5,
  })
}

function useKaspaPrice() {
  const { settings } = useSettings()

  return useQuery({
    queryKey: ['kaspaPrice', settings.currency],
    queryFn: async () => {
      try {
        return await fetchPrice(settings.currency, KAS_TICKER, KAS_NAME)
      } catch (error) {
        try {
          console.error('Failed to fetch price from Ghost API, falling back to CoinGecko:', error)
          return await fetchFromCoinGecko(settings.currency, KAS_NAME)
        } catch (error) {
          if (settings.currency === 'USD') {
            return fetchFromKaspaApi()
          }
        }
      }
    },
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000, // 30 seconds
    retry: 5,
  })
}

function useTetherPrice() {
  const { settings } = useSettings()

  return useQuery({
    queryKey: ['tetherPrice', settings.currency],
    queryFn: async () => {
      try {
        return await fetchPrice(settings.currency, USDT_TICKER, USDT_NAME)
      } catch (error) {
        try {
          console.error('Failed to fetch price from Ghost API, falling back to CoinGecko:', error)
          return await fetchFromCoinGecko(settings.currency, USDT_NAME)
        } catch (error) {
          if (settings.currency === 'USD') {
            return 1.0
          }
        }
      }
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
    refetchInterval: 60 * 60 * 1000, // 60 minutes
    retry: 5,
  })
}
