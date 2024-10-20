import { formatBalance } from '@/utils/formatting'

export const sortTokensByValue = (
  tokens: Array<{
    tick: string
    balance: string
    floorPrice?: number
    dec: string
    opScoreMod: string
  }>,
) => {
  return tokens
    .map(({ tick, balance, floorPrice = 0, dec, opScoreMod }) => {
      let formattedBalance

      // Skip formatting for KASPA, because Kas already has decimals inserted
      // TODO see where decimals were already inserted in previous sections?
      if (tick === 'KASPA') {
        formattedBalance = parseFloat(balance)
      } else {
        formattedBalance = parseFloat(formatBalance(balance, dec))
      }

      const totalValue = floorPrice * formattedBalance
      return { tick, balance, floorPrice, dec, opScoreMod, totalValue }
    })
    .sort((a, b) => b.totalValue - a.totalValue) // Sort by total value
}
