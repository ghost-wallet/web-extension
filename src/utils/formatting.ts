export const formatBalance = (balance: string, decimals: string | number): number => {
  const dec = typeof decimals === 'string' ? parseInt(decimals, 10) : decimals
  if (dec === 0) return parseFloat(balance)

  const factor = Math.pow(10, dec)
  return parseFloat(balance) / factor
}

export const formatBalanceWithAbbreviation = (number: number): string => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(0)}M`
  }
  if (number % 1 === 0) {
    return number.toLocaleString()
  }
  return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // Up to two decimal places for fractional values
}

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 12)}.....${address.slice(-8)}`
}
