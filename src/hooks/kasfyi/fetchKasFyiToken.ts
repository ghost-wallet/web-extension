import axios from 'axios'
import { KasFyiToken } from '@/utils/interfaces'

/**
 * Fetch token info from Kas.FYI
 * @param tick - The token ticker.
 * @returns The fetched token data or a default object if an error occurred.
 */

export const fetchKasFyiToken = async (tick: string): Promise<KasFyiToken> => {
  try {
    const response = await axios.get<KasFyiToken>(`https://api-v2-do.kas.fyi/token/krc20/${tick}/info`)
    console.log(`fetched information on tick ${tick}:`, response.data)
    return response.data
  } catch (error) {
    console.error(`Error fetching kas.fyi token`, error)
    return {
      ticker: tick,
      price: {
        floorPrice: 0,
      },
    }
  }
}
