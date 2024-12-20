interface CoinGeckoResponse {
  [name: string]: {
    [key: string]: number
  }
}

export const fetchFromCoinGecko = async (currency: string, names: string): Promise<CoinGeckoResponse> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?include_market_cap=true&include_24hr_vol=true&precision=full&ids=${names}&vs_currencies=${currency.toUpperCase()}`,
  )

  if (!response.ok) {
    throw new Error('Failed to fetch price from CoinGecko API')
  }

  return await response.json()
}
