import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import { KRC20TokenList, TokenFromApi } from '@/utils/interfaces'

export const fetchKrc20TokenList = async (selectedNode: number) => {
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
        `https://${apiBase}.kasplex.org/v1/krc20/tokenlist?${params.toString()}`,
      )

      if (response.data && response.data.result) {
        allTokens = [...allTokens, ...response.data.result]
        nextPage = response.data.next
      } else {
        throw new Error('Error fetching KRC20 token list. Invalid API response structure')
      }
    } while (nextPage)

    return allTokens
  } catch (error) {
    console.error('Error fetching KRC20 token list:', error)
    throw error
  }
}
