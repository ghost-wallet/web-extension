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

export const fetchTokens = async (address: string, apiBase: string, price: number): Promise<Token[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `https://${apiBase}.kasplex.org/v1/krc20/address/${address}/tokenlist`,
    )

    if (response.data && response.data.result) {
      return await Promise.all(
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
    } else {
      throw new Error('Error feteching KRC20 tokens. Invalid API response structure')
    }
  } catch (error) {
    console.error('Error fetching tokens:', error)
    throw error
  }
}
