export interface PriceDetails {
  price: number
  market_cap: number
  volume_24h: number
}
interface PriceAPIResponse {
  source: string
  currency: string
  prices: {
    [name: string]: PriceDetails
  }
}

export const fetchPriceV2 = async (currency: string, names: string): Promise<PriceAPIResponse> => {
  const url = `https://price-api.ghostwallet.org/v1/price?currency=${currency}&names=${names}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      console.error('Cloudflare response not ok')
      throw new Error('Failed to fetch price from Ghost API')
    }

    const data = await response.json()

    console.log('Cloudflare json response:', JSON.stringify(data, null, 2))

    if (!data || typeof data.source !== 'string' || typeof data.currency !== 'string' || !data.prices) {
      console.error('Cloudflare response data structure wrong')
      throw new Error('Unexpected response structure from Ghost Price v2 API')
    }

    return data as PriceAPIResponse
  } catch (error) {
    console.error('Error fetching price data:', error)
    throw error
  }
}
