import { formatNumberWithDecimal } from '@/utils/formatting'
import { Token } from './interfaces'

const formatter = Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const getMintedPercentage = (minted: number, max: number): number => {
  if (max === 0) return 0

  return parseFloat(((minted / max) * 100).toFixed(2))
}

export const calculateKRC20TotalValue = ({ balance, dec, floorPrice }: Token): string => {
  const value = formatNumberWithDecimal(balance, dec) * floorPrice

  return formatter.format(value)
}

export const calculateKaspaTotalValue = (balance: number, kaspaPrice: number): string => {
  const value = balance * kaspaPrice

  return formatter.format(value)
}
