export const formatValue = (value: number | null | undefined): number => {
  if (value === 0 || value === null || value === undefined) {
    return 0
  }
  return value
}

export const formatNumberWithDecimal = (balance: number, decimals: number): number => {
  if (isNaN(decimals) || decimals < 0) {
    throw new Error('Invalid decimals value')
  }

  if (decimals === 0) return balance

  const factor = Math.pow(10, decimals)
  return parseFloat((balance / factor).toFixed(decimals))
}

export const formatTokenBalance = (balance: number, tick: string, decimals: number): number => {
  if (tick === 'KASPA') {
    return parseFloat(balance.toFixed(balance % 1 === 0 ? 0 : 2))
  } else {
    return formatNumberWithDecimal(balance, decimals)
  }
}

export const tokenPriceFormatter = (value: number): string => {
  if (value >= 1) {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const valueStr = value.toFixed(20).replace(/\.?0+$/, '')
  const match = valueStr.match(/^0\.(0+)/)
  const zeroCount = match ? match[1].length : 0

  if (zeroCount === 3) {
    return value.toFixed(7).replace(/0+$/, '')
  }

  if (zeroCount >= 4) {
    const significantPart = valueStr.slice(zeroCount + 2).slice(0, 4)
    return `0.${zeroCount ? `0(${zeroCount})` : ''}${significantPart}`
  }

  if (zeroCount < 4) {
    const roundedValue = value.toFixed(7).replace(/0+$/, '')
    return parseFloat(roundedValue).toString()
  }

  return value.toString()
}

export const formatNumberWithAbbreviation = (balance: number): string => {
  const formatNumber = (num: number): string => {
    const rounded = parseFloat(num.toFixed(2))

    if (rounded % 1 === 0) {
      return rounded.toLocaleString()
    }

    return rounded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  if (balance >= 1_000_000_000_000_000) {
    return formatNumber(balance / 1_000_000_000_000_000) + 'Q'
  } else if (balance >= 1_000_000_000_000) {
    return formatNumber(balance / 1_000_000_000_000) + 'T'
  } else if (balance >= 1_000_000_000) {
    return formatNumber(balance / 1_000_000_000) + 'B'
  } else if (balance >= 1_000_000) {
    return formatNumber(balance / 1_000_000) + 'M'
  } else {
    return formatNumber(balance)
  }
}

// export const formatTime = (time: number): string => {
//   if (time < 1) {
//     return '<1'
//   }
//   if (time % 1 === 0) {
//     return time.toFixed(0)
//   }
//   if (time % 1 !== 0 && time.toFixed(1).endsWith('.0')) {
//     return Math.round(time).toString()
//   }
//   return time.toFixed(1)
// }

export const truncateAddress = (address: string): string => {
  return `${address.slice(0, 12)}.....${address.slice(-8)}`
}
