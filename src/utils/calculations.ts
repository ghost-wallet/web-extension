import { formatBalance } from '@/utils/formatting'

export const getMintedPercentage = (minted: number, max: number): string => {
  if (max === 0) return '0'
  return ((minted / max) * 100).toFixed(2)
}
export const calculateTotalValue = (
  balance: number,
  floorPrice: number,
  tick: string,
  dec: number,
): string => {
  const value =
    tick === 'KASPA'
      ? balance * floorPrice
      : parseFloat(String(formatBalance(balance.toString(), dec))) * floorPrice

  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
