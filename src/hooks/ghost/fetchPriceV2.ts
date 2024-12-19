export const fetchPriceV2 = async (currency: string, ticker: string, name: string): Promise<number> => {
  const url = `https://price-api.ghostwallet.org/price?currency=${currency}&ticker=${ticker}&name=${name}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch price from Ghost API')
  }

  const data = await response.json()
  if (!data || !data.price || typeof data.price !== 'number') {
    throw new Error('Unexpected response structure from Ghost Price v2 API')
  }
  return data.price
}
