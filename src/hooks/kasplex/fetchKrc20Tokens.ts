import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'

export interface Token {
  tick: string
  balance: string
  opScoreMod: string
  dec: string
  floorPrice?: number
}

interface Tokens {
  result: Token[]
  next: string | null
}

interface TokenInfoResponse {
  price?: {
    floorPrice?: number
  }
}

export const fetchKrc20Tokens = async (
  selectedNode: number,
  address: string,
  price: number,
): Promise<Token[]> => {
  const cacheKey = `tokens_${address}`
  const timestampKey = `tokens_timestamp_${address}`
  const cachedTokens = localStorage.getItem(cacheKey)
  const cachedTimestamp = localStorage.getItem(timestampKey)
  const currentTime = Date.now()
  const apiBase = getApiBase(selectedNode)

  if (cachedTokens && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 30000) {
    try {
      const parsedTokens = JSON.parse(cachedTokens)
      return parsedTokens as Token[]
    } catch (error) {
      console.error('Error parsing cached tokens:', error)
    }
  }

  try {
    let allTokens: Token[] = []
    let nextPage: string | null = null

    do {
      const params = new URLSearchParams()
      if (nextPage) {
        params.append('next', nextPage)
      }

      const response = await axios.get<Tokens>(
        `https://${apiBase}.kasplex.org/v1/krc20/address/${address}/tokenlist?${params.toString()}`,
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

        allTokens = [...allTokens, ...tokens]
        nextPage = response.data.next
      } else {
        throw new Error('Error fetching KRC20 tokens. Invalid API response structure')
      }
    } while (nextPage)

    localStorage.setItem(cacheKey, JSON.stringify(allTokens))
    localStorage.setItem(timestampKey, currentTime.toString())

    return allTokens
  } catch (error) {
    console.error('Error fetching tokens:', error)
    throw error
  }
}
