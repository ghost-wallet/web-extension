import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useSettings from '@/hooks/contexts/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'
import { formatTokenBalance, formatNumberAbbreviated } from '@/utils/formatting'
import useKaspaPrice from '@/hooks/kaspa/useKaspaPrice'
import { useKsprPrices } from '@/hooks/kspr/fetchKsprPrices'

const useChaingeTokenData = (amount: string, token: ChaingeToken | null, tokens: any[]) => {
  const { settings } = useSettings()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const ksprPricesQuery = useKsprPrices()
  const kasPrice = kaspaPrice.data ?? 0
  const currencySymbol = getCurrencySymbol(settings.currency)

  const tokenSymbol = token?.symbol || 'KAS'
  const tokenData = tokens.find(
    (t) => t.tick === tokenSymbol || (t.tick === 'KASPA' && tokenSymbol === 'KAS'),
  )

  const availableBalance = tokenData ? Number(tokenData.balance) : 0
  const formattedBalance = tokenData
    ? formatTokenBalance(availableBalance, tokenData.tick, Number(tokenData.dec))
    : 0

  const ksprPriceData = ksprPricesQuery.data?.[tokenSymbol]
  const floorPrice =
    tokenSymbol === 'KAS'
      ? kasPrice
      : tokenSymbol === 'USDT'
        ? 1
        : ksprPriceData
          ? ksprPriceData.floor_price * kasPrice
          : 0
  const currencyValue = (Number(amount) * floorPrice).toFixed(2)
  const formattedCurrencyValue = formatNumberAbbreviated(Number(currencyValue))

  return {
    currencySymbol,
    formattedCurrencyValue,
    formattedBalance,
    availableBalance,
    tokenSymbol,
  }
}

export default useChaingeTokenData
