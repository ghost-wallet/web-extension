import { useMemo, useState, useEffect } from 'react'
import { sortTokensByValue } from '@/utils/sorting'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspa from '@/hooks/contexts/useKaspa'
import useKaspaPrice from '@/hooks/kaspa/useKaspaPrice'
import { isKrc20QueryEnabled, useKrc20TokensQuery } from '@/hooks/kasplex/fetchKrc20AddressTokenList'
import { useKsprPrices } from '@/hooks/kspr/fetchKsprPrices'
import { KaspaToken, TokenFromApi, Token } from '@/utils/interfaces'
import { useKasFyiMarketData } from '@/hooks/kas-fyi/fetchMarketData'

export function useWalletTokens() {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const kasPrice = kaspaPrice.data ?? 0
  const selectedNetwork = settings.nodes[settings.selectedNode].address
  const [walletError, setWalletError] = useState<string | null>(null)

  const isQueryEnabled = isKrc20QueryEnabled(kaspa, selectedNetwork)
  const krc20TokensQuery = useKrc20TokensQuery(settings, kaspa, isQueryEnabled)
  const krc20TokensData = krc20TokensQuery.data

  const tickers = useMemo(() => {
    return krc20TokensData?.map((token: TokenFromApi) => token.tick) || []
  }, [krc20TokensData])

  const kasFyiMarketDataQuery = useKasFyiMarketData(tickers)
  const kasFyiMarketData = kasFyiMarketDataQuery.data

  const ksprPricesQuery = kasFyiMarketData ? null : useKsprPrices()
  const ksprPricesData = ksprPricesQuery?.data

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

  const tokens = useMemo(() => {
    if (!krc20TokensData) {
      return [kaspaCrypto]
    }

    const tokensWithPrices = krc20TokensData.map((token) => {
      if (kasFyiMarketData) {
        const kasFyiToken = kasFyiMarketData.results.find((data) => data.ticker === token.tick)
        const floorPrice = token.tick === 'CUSDT' ? 1.0 : (kasFyiToken?.price.kas || 0) * kasPrice

        return {
          ...token,
          floorPrice,
        } as Token
      } else if (ksprPricesData) {
        const ksprToken = ksprPricesData[token.tick]

        return {
          ...token,
          floorPrice: token.tick === 'CUSDT' ? 1.0 : (ksprToken?.floor_price || 0) * kasPrice,
        } as Token
      } else {
        return {
          ...token,
          floorPrice: 0,
        } as Token
      }
    })

    return [kaspaCrypto, ...tokensWithPrices] as (KaspaToken | Token)[]
  }, [kaspaCrypto, krc20TokensData, kasFyiMarketData, ksprPricesData, kasPrice])

  const sortedTokens = sortTokensByValue(tokens)

  useEffect(() => {
    if (krc20TokensQuery.isError) {
      setWalletError(krc20TokensQuery.error?.message || 'An unknown error occurred while fetching tokens.')
    }
  }, [krc20TokensQuery.isError, krc20TokensQuery.error])

  return { tokens: sortedTokens, walletError }
}
