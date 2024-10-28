import { formatNumberWithDecimal } from '@/utils/formatting'

export const getMintedPercentage = (minted: number, max: number): number => {
  if (max === 0) return 0

  return parseFloat(((minted / max) * 100).toFixed(2))
}

export const calculateTotalValue = (
  balance: number,
  floorPrice: number,
  tick: string,
  dec: number,
): string => {
  const value = tick === 'KASPA' ? balance * floorPrice : formatNumberWithDecimal(balance, dec) * floorPrice

  return value.toFixed(2)
}
