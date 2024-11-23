import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import useSettings from '@/hooks/contexts/useSettings'
import { formatTokenBalance } from '@/utils/formatting'
import useChaingePrice from '@/hooks/chainge/useChaingePrice'

const useChaingeTokenData = (amount: string, token: ChaingeToken | null, tokens: any[]) => {
  const { settings } = useSettings()
  const chaingePriceData = useChaingePrice(token)

  const tokenSymbol = token?.symbol || 'KAS'
  const tokenData = tokens.find(
    (t) =>
      t.tick === tokenSymbol ||
      (t.tick === 'KASPA' && tokenSymbol === 'KAS') ||
      (t.tick === 'CUSDT' && token?.symbol === 'USDT'),
  )

  const availableBalance = tokenData ? Number(tokenData.balance) : 0
  const formattedBalance = tokenData
    ? formatTokenBalance(availableBalance, tokenData.tick, Number(tokenData.dec))
    : 0

  const tokenPrice = chaingePriceData?.data?.data?.price ?? '0'
  const currencyValue = Number(amount) * Number(tokenPrice)

  const formattedCurrencyValue = currencyValue.toLocaleString(undefined, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return {
    formattedCurrencyValue,
    formattedBalance,
    availableBalance,
    tokenSymbol,
    currencyValue,
  }
}

export default useChaingeTokenData
