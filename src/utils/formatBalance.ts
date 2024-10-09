export const formatBalance = (balance: string, decimals: string): string => {
  const dec = parseInt(decimals, 10)
  if (dec === 0) return balance

  return balance.slice(0, -dec) || '0'
}
