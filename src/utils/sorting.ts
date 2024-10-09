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
      const totalValue = floorPrice * parseFloat(formatBalance(balance, dec))
      return { tick, balance, floorPrice, dec, opScoreMod, totalValue }
    })
    .sort((a, b) => b.totalValue - a.totalValue)
}
