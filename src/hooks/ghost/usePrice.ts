import { fetchPriceV2 } from './fetchPriceV2'
import { fetchFromCoinGecko } from '../coingecko/fetchFromCoinGecko'
import { useQuery } from '@tanstack/react-query'
import useSettings from '@/hooks/contexts/useSettings'

const KAS_NAME = 'kaspa'
const USDT_NAME = 'tether'

export function usePrices() {
  const { settings } = useSettings()
  const names = `${KAS_NAME},${USDT_NAME}`

  return useQuery({
    queryKey: ['cryptoPrices', settings.currency],
    queryFn: async () => {
      try {
        const response = await fetchPriceV2(settings.currency, names)
        return {
          kaspa: {
            price: response.prices.kaspa.price,
            marketCap: response.prices.kaspa.market_cap,
            volume24h: response.prices.kaspa.volume_24h,
          },
          tether: {
            price: response.prices.tether.price,
            marketCap: response.prices.tether.market_cap,
            volume24h: response.prices.tether.volume_24h,
          },
        }
      } catch (error) {
        console.error('Failed to fetch prices from Ghost Cloudflare API. Falling back to CoinGecko:', error)
        const response = await fetchFromCoinGecko(settings.currency, names)

        return {
          kaspa: {
            price: response.kaspa[settings.currency.toLowerCase()],
            marketCap: response.kaspa[`${settings.currency.toLowerCase()}_market_cap`],
            volume24h: response.kaspa[`${settings.currency.toLowerCase()}_24h_vol`],
          },
          tether: {
            price: response.tether[settings.currency.toLowerCase()],
            marketCap: response.tether[`${settings.currency.toLowerCase()}_market_cap`],
            volume24h: response.tether[`${settings.currency.toLowerCase()}_24h_vol`],
          },
        }
      }
    },
    staleTime: 30_000, // 30 seconds
    refetchInterval: 30_000, // 30 seconds
    retry: 5,
  })
}
