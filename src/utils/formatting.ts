export const formatBalance = (balance: string, decimals: string): string => {
  const dec = parseInt(decimals, 10)
  if (dec === 0) return balance

  return balance.slice(0, -dec) || '0'
}

export const formatValue = (value: number): string => {
  if (value >= 1) {
    return value.toFixed(2)
  } else if (value >= 0.01) {
    return value.toFixed(4)
  } else {
    return value.toFixed(7)
  }
}
