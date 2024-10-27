import { formatNumberWithDecimal } from '@/utils/formatting'
import { ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import { Token } from '@/utils/interfaces'

export const sortTokensByValue = (tokens: Token[]): Token[] => {
  return tokens
    .map(({ tick, balance, floorPrice = 0, dec, opScoreMod }) => {
      let formattedBalance: number

      // Skip formatting for KASPA, because Kas already has decimals inserted
      if (tick === 'KASPA') {
        formattedBalance = balance
      } else {
        formattedBalance = formatNumberWithDecimal(balance, dec)
      }

      const totalValue = floorPrice * formattedBalance
      return { tick, balance, floorPrice, dec, opScoreMod, totalValue }
    })
    .sort((a, b) => b.totalValue - a.totalValue) // Sort by total value
}

export const sortChaingeTokens = (tokens: ChaingeToken[]): ChaingeToken[] => {
  const tokenPriorityOrder: string[] = ['KAS', 'USDT', 'USDC', 'BTC', 'ETH', 'XCHNG']

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
