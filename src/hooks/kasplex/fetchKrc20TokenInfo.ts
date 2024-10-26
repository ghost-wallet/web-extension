import axios from 'axios'
import { getApiBase } from './fetchHelper'

export interface Krc20TokenInfo {
  tick: string
  max: number
  lim: string
  pre: number
  to: string
  dec: number
  minted: number
  opScoreAdd: string
  opScoreMod: string
  state: string
  hashRev: string
  mtsAdd: string
  holderTotal: number
  transferTotal: number
  mintTotal: number
}

interface Krc20TokenApiResponse {
  message: string
  result: Krc20TokenInfo[]
}

export const fetchKrc20TokenInfo = async (
  selectedNode: number,
  ticker: string,
): Promise<Krc20TokenInfo | null> => {
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