import useSettings from '@/hooks/contexts/useSettings'

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
  const { settings } = useSettings()

  if (value >= 1) {
    return value.toLocaleString(navigator.language, {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const valueStr = value.toFixed(20).replace(/\.?0+$/, '')
  const match = valueStr.match(/^0\.(0+)/)
  const zeroCount = match ? match[1].length : 0

  if (zeroCount === 3) {
    return parseFloat(value.toFixed(7)).toLocaleString(navigator.language, {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 7,
    })
  }

  if (zeroCount >= 4) {
    const significantPart = valueStr.slice(zeroCount + 2).slice(0, 4)
    const formatted = parseFloat(`0.${significantPart}`).toLocaleString(navigator.language, {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    })
    return `0.${zeroCount ? `0(${zeroCount})` : ''}${formatted.slice(2)}`
  }

  if (zeroCount < 4) {
    const roundedValue = parseFloat(value.toFixed(7))
    return roundedValue.toLocaleString(navigator.language, {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 7,
    })
  }

  return value.toLocaleString(navigator.language, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  })
}

export const formatNumberAbbreviated = (balance: number): string => {
  const formatNumber = (num: number): string => {
    const options: Intl.NumberFormatOptions =
      num % 1 === 0 ? { maximumFractionDigits: 0 } : { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    return num.toLocaleString(navigator.language, options)
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
    return balance.toLocaleString(navigator.language, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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

// TODO: still need to abbreviate market caps?
// export const formatMarketCapAbbreviated = (minted: number, dec: number, floorPrice: number): string => {
//   const marketCap = Math.floor(getMarketCap(minted, dec, floorPrice))
//   if (marketCap < 100_000_000) {
//     return marketCap.toLocaleString()
//   }
//   return formatNumberAbbreviated(marketCap)
// }

export const formatMarketCap = (minted: number, dec: number, floorPrice: number): string => {
  const { settings } = useSettings()
  const marketCap = getMarketCap(minted, dec, floorPrice)

  return marketCap.toLocaleString(navigator.language, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export const formatAndValidateAmount = (value: string, maxDecimals: number): string | null => {
  const decimalPlaces = value.split('.')[1]?.length || 0
  if (decimalPlaces > maxDecimals) return null

  if (value.startsWith('.') && value.length > 1) {
    value = `0${value}`
  }

  return value
}
