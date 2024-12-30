import { formatNumberWithDecimal } from '@/utils/formatting'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'
import { AccountToken, SearchToken } from '@/types/interfaces'
import { getMarketCap } from '@/utils/formatting'
import { KAS_TICKER, USDT_TICKER } from '@/utils/constants/tickers'
import { Krc20TokenState } from '@/types/kasplex'

export const sortTokensByValue = (tokens: (AccountToken)[]) => {
  return tokens
    .map((token) => {
      let formattedBalance: number

      // Skip formatting for KASPA, because Kas already has decimals inserted
      if (token.isKaspa) {
        formattedBalance = token.balance
      } else {
        formattedBalance = formatNumberWithDecimal(token.balance, token.dec)
      }

      const totalValue = token.floorPrice * formattedBalance
      return {
        ...token,
        totalValue,
      }
    })
    .sort((a, b) => b.totalValue - a.totalValue) // Sort by total value
}

export const sortSearchResults = (krc20TokenList: SearchToken[], ticker: string) => {
  return krc20TokenList
    .filter((token) => token.tick.toLowerCase().includes(ticker.toLowerCase()))
    .map((token) => {
      const marketCap = getMarketCap(Number(token.minted), Number(token.dec), Number(token.floorPrice ?? 0))
      return {
        ...token,
        marketCap,
      }
    })
    .sort((a, b) => {
      // 1. Prioritize deployed tokens
      if (a.state === 'deployed' && b.state !== 'deployed') return -1
      if (b.state === 'deployed' && a.state !== 'deployed') return 1

      // 2. Sort alphabetically by ticker
      return a.tick.localeCompare(b.tick)
    })
}

export const sortChaingeTokens = (tokens: ChaingeToken[]): ChaingeToken[] => {
  const tokenPriorityOrder: string[] = [KAS_TICKER, USDT_TICKER, 'USDC', 'BTC', 'ETH', 'XCHNG']

  return tokens.sort((a, b) => {
    const indexA = tokenPriorityOrder.indexOf(a.symbol)
    const indexB = tokenPriorityOrder.indexOf(b.symbol)

    if (indexA === -1 && indexB === -1) {
      // Neither token is in the priority list, maintain their original order
      return 0
    } else if (indexA === -1) {
      // Token A is not in the priority list, Token B comes first
      return 1
    } else if (indexB === -1) {
      // Token B is not in the priority list, Token A comes first
      return -1
    } else {
      // Both tokens are in the priority list, compare their indexes
      return indexA - indexB
    }
  })
}
