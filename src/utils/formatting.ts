export const formatValue = (value: string | number | null | undefined): string => {
  if (value === '0' || value === 0 || value === null || value === undefined) {
    return '0'
  }
  return value.toString()
}

export const formatBalance = (balance: string, decimals: string | number): number => {
  const dec = typeof decimals === 'string' ? parseInt(decimals, 10) : decimals
  if (dec === 0) return parseFloat(balance)

  const factor = Math.pow(10, dec)
  return parseFloat(balance) / factor
}

export const formatTokenBalance = (balance: string, tick: string, decimals: string | number): string => {
  return tick === 'KASPA'
    ? parseFloat(balance).toLocaleString(undefined, {
        minimumFractionDigits: parseFloat(balance) % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8,
      })
    : formatBalance(balance, decimals).toLocaleString(undefined, {
        minimumFractionDigits: formatBalance(balance, decimals) % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 8,
      })
}

export const formatTokenPrice = (price: number): string => {
  if (price >= 1) {
    return price.toFixed(2) // For prices >= 1, round to 2 decimal places
  } else if (price >= 0.01) {
    return price.toFixed(2) // For prices between 0.01 and 1, round to 2 decimal places
  } else if (price >= 0.0001) {
    return price.toFixed(4) // For prices between 0.0001 and 0.01, round to 4 decimal places
  } else if (price >= 0.0000001) {
    return price.toFixed(8) // For prices between 0.0000001 and 0.0001, round to 8 decimal places
  } else if (price > 0) {
    return price.toFixed(10) // For very small numbers, round to 10 decimal places
  } else {
    return '0' // Handle cases where price is 0 or less
  }
}

export const formatBalanceWithAbbreviation = (number: number): string => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(2)}M` // Two decimal places for millions
  }
  if (number % 1 === 0) {
    return number.toLocaleString()
  }
  return number.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // Up to two decimal places for fractional values
}

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 12)}.....${address.slice(-8)}`
}

export const formatSupplyWithAbbreviation = (supply: number, dec: number): string => {
  // Adjust supply by dividing by 10^dec
  const adjustedSupply = supply / Math.pow(10, dec)

  // Helper function to format the number, keeping decimal places only if they are non-zero
  const formatNumber = (num: number): string => {
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(1)
  }

  if (adjustedSupply >= 1_000_000_000_000_000_000) {
    return `${formatNumber(adjustedSupply / 1_000_000_000_000_000_000)}Qn` // Quintillions
  } else if (adjustedSupply >= 1_000_000_000_000_000) {
    return `${formatNumber(adjustedSupply / 1_000_000_000_000_000)}Qd` // Quadrillions
  } else if (adjustedSupply >= 1_000_000_000_000) {
    return `${formatNumber(adjustedSupply / 1_000_000_000_000)}T` // Trillions
  } else if (adjustedSupply >= 1_000_000_000) {
    return `${formatNumber(adjustedSupply / 1_000_000_000)}B` // Billions
  } else if (adjustedSupply >= 1_000_000) {
    return `${formatNumber(adjustedSupply / 1_000_000)}M` // Millions
  } else {
    return adjustedSupply.toFixed(1) // Less than a million, no abbreviation
  }
}
