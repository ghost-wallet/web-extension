import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import { KRC20TokenList, TokenFromApi } from '@/utils/interfaces'

export const fetchKrc20AddressTokenList = async (selectedNode: number, address: string) => {
  const apiBase = getApiBase(selectedNode)

  try {
    let allTokens: TokenFromApi[] = []
    let nextPage: string | null = null

    do {
      const params = new URLSearchParams()
      if (nextPage) {
        params.append('next', nextPage)
      }

      const response = await axios.get<KRC20TokenListForAddress>(
        `https://${apiBase}.kasplex.org/v1/krc20/address/${address}/tokenlist?${params.toString()}`,
      )

      if (response.data && response.data.result) {
        allTokens = [...allTokens, ...response.data.result]
        nextPage = response.data.next
      } else if (response.status === 204) {
        throw new Error(
          `Error 204: cannot get your KRC20 tokens from Kasplex API. If you're using security software like a VPN, disable advanced protection or turn it off and restart your computer.`,
        )
      } else {
        throw new Error(
          `Error ${response.status}: cannot get your KRC20 tokens from Kasplex API. Kasplex API is currently down or unavailable.`,
        )
      }
    } while (nextPage)

    return allTokens
  } catch (error) {
    console.error(`Error fetching KRC20 token list for address ${address}:`, error)
    throw error
  }
}
