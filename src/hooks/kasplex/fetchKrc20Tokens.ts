import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import { Token, KRC20TokenList } from '@/utils/interfaces'
import { fetchKasFyiToken } from '@/hooks/kasfyi/fetchKasFyiToken'

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

  if (cachedTokens && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < 60000) {
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

      const response = await axios.get<KRC20TokenList>(
        `https://${apiBase}.kasplex.org/v1/krc20/address/${address}/tokenlist?${params.toString()}`,
      )

      if (response.data && response.data.result) {
        const tokens = await Promise.all(
          response.data.result.map(async (token: Token) => {
            const tokenData = await fetchKasFyiToken(token.tick)
            console.log('fetched Kas FYI token. check the price and floorprice', tokenData)
            const floorPrice = tokenData?.price?.floorPrice ? tokenData.price.floorPrice * price : 0

            return { ...token, floorPrice }
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
