import axios from 'axios'
import { Token } from './kasplexReducer'

interface ApiResponse {
  result: Token[]
}

interface TokenInfoResponse {
  price?: {
    floorPrice?: number
  }
}

export const fetchTokens = async (
  address: string,
  apiBase: string,
  price: number,
  refresh = false,
): Promise<Token[]> => {
  const cacheKey = `tokens_${address}`
  const timestampKey = `tokens_timestamp_${address}`
  const cachedTokens = localStorage.getItem(cacheKey)
  const cachedTimestamp = localStorage.getItem(timestampKey)
  const currentTime = Date.now()

  if (!refresh && cachedTokens && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 15000) {
    try {
      const parsedTokens = JSON.parse(cachedTokens)
      return parsedTokens as Token[]
    } catch (error) {
      console.error('Error parsing cached tokens:', error)
    }
  }

  try {
    const response = await axios.get<ApiResponse>(
      `https://${apiBase}.kasplex.org/v1/krc20/address/${address}/tokenlist`,
    )

    if (response.data && response.data.result) {
      const tokens = await Promise.all(
        response.data.result.map(async (token: Token) => {
          try {
            const tokenInfoResponse = await axios.get<TokenInfoResponse>(
              `https://api-v2-do.kas.fyi/token/krc20/${token.tick}/info`,
            )
            const tokenData = tokenInfoResponse.data
            const floorPrice = ((tokenData?.price?.floorPrice || 0) * price).toFixed(8)

            return { ...token, floorPrice: parseFloat(floorPrice) }
          } catch (err) {
            console.error(`Error fetching info for ${token.tick}:`, err)
            return { ...token, floorPrice: 0 }
          }
        }),
      )

      localStorage.setItem(cacheKey, JSON.stringify(tokens))
      localStorage.setItem(timestampKey, currentTime.toString())

      return tokens
    } else {
      throw new Error('Error fetching KRC20 tokens. Invalid API response structure')
    }
  } catch (error) {
    console.error('Error fetching tokens:', error)
    throw error
  }
}
