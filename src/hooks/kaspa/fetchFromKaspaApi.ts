// TODO: remove if safe to rely on coingecko
export const fetchFromKaspaApi = async (): Promise<number> => {
  const response = await fetch('https://api.kaspa.org/info/price')

  if (!response.ok) {
    throw new Error('Failed to fetch price from Kaspa API')
  }
  console.log('fetched price from kas api:', response)

  const data = await response.json()
  return data.price
}
