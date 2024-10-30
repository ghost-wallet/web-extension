import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import { Token, KRC20TokenList } from '@/utils/interfaces'
import { fetchKasFyiToken } from '@/hooks/kasfyi/fetchKasFyiToken'

export const fetchKrc20Tokens = async (
  selectedNode: number,
  address: string,
  //price: number,
): Promise<Token[]> => {
  const apiBase = getApiBase(selectedNode)

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
            return { ...token, floorPrice: tokenData?.price?.floorPrice ?? 0 }
          }),
        )

        allTokens = [...allTokens, ...tokens]
        nextPage = response.data.next
      } else {
        throw new Error('Error fetching KRC20 tokens. Invalid API response structure')
      }
    } while (nextPage)
      
    return allTokens
  } catch (error) {
    console.error('Error fetching tokens:', error)
    throw error
  }
}
