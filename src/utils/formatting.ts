export const formatBalance = (balance: string, decimals: string): string => {
  console.log('formatting with balance, decimals', balance, decimals)
  const dec = parseInt(decimals, 10)
  if (dec === 0) return balance

  const factor = Math.pow(10, dec)
  const numericalBalance = parseFloat(balance) / factor

  return numericalBalance.toString() // Return the full balance with all decimal places
}

export const formatValue = (value: number): string => {
  return value.toFixed(2)
}

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 12)}.....${address.slice(-8)}`
}
