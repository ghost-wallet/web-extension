import axios from 'axios'
import { KasFyiTokenList } from '@/utils/interfaces'

/**
 * Fetch the massive token list from kas.fyi.
 * @returns The fetched token list or an object with an empty `results` array if an error occurred.
 */

// TODO: need API key or use new API to get prices
export const fetchKasFyiTokenList = async (): Promise<KasFyiTokenList> => {
  try {
    const response = await axios.get<KasFyiTokenList>(`https://api-v2-do.kas.fyi/token/krc20/tokens`)
    return response.data
  } catch (error) {
    console.error(`Error fetching kas.fyi token list`, error)
    return { results: [] }
  }
}
