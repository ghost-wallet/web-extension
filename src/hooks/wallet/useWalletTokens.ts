import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { sortTokensByValue } from '@/utils/sorting'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspa from '@/hooks/contexts/useKaspa'
import useKaspaPrice from '@/hooks/kaspa/useKaspaPrice'
import { fetchKrc20AddressTokenList } from '@/hooks/kasplex/fetchKrc20AddressTokenList'
import { useKsprPrices } from '@/hooks/kspr/fetchKsprPrices'
import { KaspaToken } from '@/utils/interfaces'

export function useWalletTokens() {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const ksprPricesQuery = useKsprPrices()
  const kasPrice = kaspaPrice.data ?? 0
  const selectedNetwork = settings.nodes[settings.selectedNode].address

  const isQueryEnabled = useMemo(() => {
    if (!(kaspa.addresses.length > 0)) return false
    const address = kaspa.addresses[0]
    if (kaspa.connected && selectedNetwork === 'mainnet' && address.startsWith('kaspa:')) {
      return true
    }
    return kaspa.connected && selectedNetwork === 'testnet-10' && address.startsWith('kaspatest:')
  }, [kaspa.addresses, kaspa.connected, settings.selectedNode])

  const krc20TokensQuery = useQuery({
    queryKey: ['krc20Tokens', { selectedNode: settings.selectedNode, address: kaspa.addresses[0] }],
    queryFn: async () => fetchKrc20AddressTokenList(settings.selectedNode, kaspa.addresses[0]),
    enabled: isQueryEnabled,
    staleTime: 6000,
    refetchInterval: 6000,
  })

  const kaspaCrypto: KaspaToken = useMemo(
    () => ({
      isKaspa: true,
      tick: 'KASPA',
      balance: kaspa.balance,
      dec: 8,
      floorPrice: kasPrice,
    }),
    [kaspa.balance, kasPrice],
  )

  // Merge KSPR token prices with KRC20 tokens, always including kaspaCrypto
  const tokens = useMemo(() => {
    const additionalTokens = krc20TokensQuery.data
      ? krc20TokensQuery.data.map((token) => {
          const ksprPriceData = ksprPricesQuery.data?.[token.tick]
          const floorPrice = ksprPriceData?.floor_price ?? 0
          return {
            ...token,
            floorPrice: floorPrice * kasPrice,
          }
        })
      : []

    return [kaspaCrypto, ...additionalTokens]
  }, [kaspaCrypto, krc20TokensQuery.data, ksprPricesQuery.data, kasPrice])

  const sortedTokens = sortTokensByValue(tokens)
  const errorMessage = krc20TokensQuery.isError ? krc20TokensQuery.error.message : null

  return { tokens: sortedTokens, errorMessage }
}
