export const fetchKasPrice = async (currency: string): Promise<number> => {
  const url = `https://3hk5khl1vl.execute-api.us-east-1.amazonaws.com/prod/price?currency=${encodeURIComponent(currency)}`

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
