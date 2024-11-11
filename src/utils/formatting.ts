export const formatValue = (value: number | null | undefined): number => {
  if (value === 0 || value === null || value === undefined) {
    return 0
  }
  return value
}

export const formatNumberWithDecimal = (balance: number | string, decimals: number | string): number => {
  if (typeof balance !== 'number') {
    balance = Number(balance)
  }
  if (typeof decimals !== 'number') {
    decimals = Number(decimals)
  }
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

export const formatNumberAbbreviated = (balance: number): string => {
  const formatNumber = (num: number): string => {
    if (num < 1 && num > 0) {
      return num.toString()
    }

    const rounded = parseFloat(num.toFixed(2))

    if (rounded % 1 === 0) {
      return rounded.toLocaleString()
    }

    return rounded.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  if (balance >= 1_000_000_000_000_000_000_000_000_000) {
    // Decillion
    return formatNumber(balance / 1_000_000_000_000_000_000_000_000_000) + 'Dc'
  } else if (balance >= 1_000_000_000_000_000_000_000_000) {
    // Nonillion
    return formatNumber(balance / 1_000_000_000_000_000_000_000_000) + 'N'
  } else if (balance >= 1_000_000_000_000_000_000_000) {
    // Octillion
    return formatNumber(balance / 1_000_000_000_000_000_000_000) + 'Oc'
  } else if (balance >= 1_000_000_000_000_000_000) {
    // Septillion
    return formatNumber(balance / 1_000_000_000_000_000_000) + 'Sp'
  } else if (balance >= 1_000_000_000_000_000) {
    // Sextillion
    return formatNumber(balance / 1_000_000_000_000_000) + 'Sx'
  } else if (balance >= 1_000_000_000_000) {
    // Quintillion
    return formatNumber(balance / 1_000_000_000_000) + 'Qi'
  } else if (balance >= 1_000_000_000) {
    // Billion
    return formatNumber(balance / 1_000_000_000) + 'B'
  } else if (balance >= 1_000_000) {
    // Million
    return formatNumber(balance / 1_000_000) + 'M'
  } else {
    return formatNumber(balance)
  }
}

export const truncateAddress = (address: string): string => {
  return `${address.slice(0, 10)}.....${address.slice(-6)}`
}

export const truncateWord = (word: string): string => {
  return word.length > 20 ? `${word.slice(0, 20)}...` : word
}

export const getMarketCap = (minted: number, dec: number, floorPrice: number): number => {
  return formatNumberWithDecimal(minted, dec) * floorPrice
}

export const formatMarketCapAbbreviated = (minted: number, dec: number, floorPrice: number): string => {
  const marketCap = Math.floor(getMarketCap(minted, dec, floorPrice))
  if (marketCap < 100_000_000) {
    return marketCap.toLocaleString()
  }
  return formatNumberAbbreviated(marketCap)
}

export const formatMarketCap = (minted: number, dec: number, floorPrice: number): string => {
  const marketCap = getMarketCap(minted, dec, floorPrice)
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(marketCap)
}
