import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import { KRC20TokenList, KRC20TokenResponse } from '@/utils/interfaces'
import ErrorMessages from '@/utils/constants/errorMessages'

export const fetchKrc20TokenList = async (selectedNode: number) => {
  const apiBase = getApiBase(selectedNode)

  try {
    let allTokens: KRC20TokenResponse[] = []
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
      } else if (response.status === 204) {
        throw new Error(ErrorMessages.KRC20.KASPLEX_204)
      } else {
        throw new Error(ErrorMessages.KRC20.KASPLEX_UNKNOWN(response.status))
      }
    } while (nextPage)

    return allTokens
  } catch (error) {
    console.error('Error fetching KRC20 token list:', error)
    throw error
  }
}
