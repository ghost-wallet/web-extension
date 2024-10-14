export const formatBalance = (balance: string, decimals: string): string => {
  const dec = parseInt(decimals, 10)
  if (dec === 0) return balance

  const factor = Math.pow(10, dec)
  const numericalBalance = parseFloat(balance) / factor

  // Check if the number is a whole number (integer) or has decimals
  if (numericalBalance % 1 === 0) {
    return numericalBalance.toString()
  }

  return numericalBalance.toFixed(2)
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

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 12)}.....${address.slice(-8)}`
}
