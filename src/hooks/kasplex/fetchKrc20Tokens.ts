import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import { Token, KRC20TokenList, TokenFromApi } from '@/utils/interfaces'

export const fetchKrc20Tokens = async (selectedNode: number, address: string) => {
  const apiBase = getApiBase(selectedNode)

  try {
    let allTokens: TokenFromApi[] = []
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
        //TODO fix interfaces and types
        allTokens = [...allTokens, ...response.data.result]
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
