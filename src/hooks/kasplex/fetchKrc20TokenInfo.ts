import axios from 'axios'
import { getApiBase } from './fetchHelper'
import { KRC20TokenResponse } from '@/types/interfaces'
import ErrorMessages from '@/utils/constants/errorMessages'
import { Krc20TokenInfoResponse } from '@/types/kasplex'

export const fetchKrc20TokenInfo = async (
  selectedNode: number,
  ticker: string,
): Promise<KRC20TokenResponse | null> => {
  const apiBase = getApiBase(selectedNode)

  try {
    const response = await axios.get<Krc20TokenInfoResponse>(
      `https://${apiBase}.kasplex.org/v1/krc20/token/${ticker}`,
    )

    if (response.status === 204 || !response.data || !response.data.result?.length) {
      console.error('No token data found:', response.data || 'Empty response')
      throw new Error(ErrorMessages.KRC20.KASPLEX_204 || 'No token data available.')
    }

    const token = response.data.result[0]

    return {
      ...token,
      max: parseFloat(token.max),
      lim: parseFloat(token.lim),
      pre: parseFloat(token.pre),
      minted: parseFloat(token.minted),
      holderTotal: parseFloat(token.holderTotal),
      transferTotal: parseFloat(token.transferTotal),
      mintTotal: parseFloat(token.mintTotal),
      dec: parseInt(token.dec),
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.status, error.response?.data || error.message)
      throw new Error(
        error.response?.data?.message || `Failed to fetch token info for ${ticker}: ${error.message}`,
      )
    }
    console.error('Unexpected error:', error)
    throw new Error(error.message || 'Unexpected error fetching token info.')
  }
}
