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
    // Return the first item in the result array
    return response.data.result[0] || null
  } catch (error) {
    console.error(`Error fetching token info for ${ticker}:`, error)
    return null
  }
}
