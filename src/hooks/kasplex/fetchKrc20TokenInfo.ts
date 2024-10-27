import axios from 'axios'
import { getApiBase } from './fetchHelper'
import { KRC20TokenResponse } from '@/utils/interfaces'

interface Krc20TokenApiResponse {
  message: string
  result: KRC20TokenResponse[]
}

export const fetchKrc20TokenInfo = async (
  selectedNode: number,
  ticker: string,
): Promise<KRC20TokenResponse | null> => {
  const apiBase = getApiBase(selectedNode)
  try {
    const response = await axios.get<Krc20TokenApiResponse>(
      `https://${apiBase}.kasplex.org/v1/krc20/token/${ticker}`,
    )

    if (response.data.result.length > 0) {
      const token = response.data.result[0]

      // Convert string field responses to numbers
      return {
        ...token,
        max: parseFloat(token.max as unknown as string),
        lim: parseFloat(token.lim as unknown as string),
        pre: parseFloat(token.pre as unknown as string),
        minted: parseFloat(token.minted as unknown as string),
        holderTotal: parseFloat(token.holderTotal as unknown as string),
        transferTotal: parseFloat(token.transferTotal as unknown as string),
        mintTotal: parseFloat(token.mintTotal as unknown as string),
      }
    }

    return null
  } catch (error) {
    console.error(`Error fetching token info for ${ticker}:`, error)
    return null
  }
}
