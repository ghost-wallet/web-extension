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

export const formatNumberAbbreviated = (balance: number, isCurrency: boolean = false): string => {
  const { settings } = useSettings()

  let options: Intl.NumberFormatOptions

  if (balance >= 1000000) {
    options = isCurrency
      ? {
          style: 'currency',
          currency: settings.currency,
          notation: 'compact',
          maximumFractionDigits: 2,
        }
      : {
          notation: 'compact',
          maximumFractionDigits: 2,
        }
  } else {
    options = isCurrency
      ? {
          style: 'currency',
          currency: settings.currency,
          maximumFractionDigits: 2,
        }
      : {
          maximumFractionDigits: 2,
        }
  }

  return balance.toLocaleString(navigator.language, options)
}

export const formatKaspaMarketCapAbbreviated = (marketCap: number): string => {
  const { settings } = useSettings()

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: settings.currency,
    maximumFractionDigits: 0,
    ...(marketCap >= 100_000_000 && { notation: 'compact' }),
  }

  return marketCap.toLocaleString(navigator.language, options)
}

export const formatMarketCapAbbreviated = (minted: number, dec: number, floorPrice: number): string => {
  const marketCap = getMarketCap(minted, dec, floorPrice)

  const { settings } = useSettings()

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: settings.currency,
    maximumFractionDigits: 0,
    ...(marketCap >= 100_000_000 && { notation: 'compact' }),
  }

  return marketCap.toLocaleString(navigator.language, options)
}

export const formatVolumeAbbreviated = (volume: number): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    ...(volume >= 100_000_000 && { notation: 'compact' }),
  }

  return volume.toLocaleString(navigator.language, options)
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

export const formatGasFee = (gasFee: string | number): string => {
  const parsedGasFee = typeof gasFee === 'string' ? parseFloat(gasFee) : gasFee
  const safeGasFee = isNaN(parsedGasFee) ? 0 : parsedGasFee
  return safeGasFee.toLocaleString(navigator.language, {
    maximumFractionDigits: 8,
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

export const formatPercentage = (value: string | number): string => {
  const parsedValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(parsedValue)) {
    throw new Error('Invalid value provided to formatPercentage')
  }

  return new Intl.NumberFormat(navigator.language, {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(parsedValue / 100)
}

export const formatUsd = (value: number): string => {
  return value.toLocaleString(navigator.language, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
