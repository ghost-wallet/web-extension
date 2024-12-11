export const fetchKasPrice = async (currency: string): Promise<number> => {
  const url = `https://dev-api.ghostwallet.ninja/price?currency=${encodeURIComponent(
    currency,
  )}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch price from Ghost API')
  }

  const data = await response.json()
  if (!data || !data.price || typeof data.price !== 'number') {
    throw new Error('Unexpected response structure from Ghost API')
  }
  return data.price
}
