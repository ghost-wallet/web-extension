import axios from 'axios'
import { KasFyiToken } from '@/utils/interfaces'

/**
 * Fetch token information from kas.fyi.
 * @param tick The token ticker symbol (e.g., "NACHO").
 * @returns The fetched token data or null if an error occurred.
 */
export const fetchKasFyiToken = async (tick: string): Promise<KasFyiToken | null> => {
  try {
    const response = await axios.get<KasFyiToken>(`https://api-v2-do.kas.fyi/token/krc20/${tick}/info`)
    return response.data
  } catch (error) {
    console.error(`Error fetching kas.fyi token info for ${tick}:`, error)
    return null
  }
}
