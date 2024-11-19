import axios from 'axios'
import { getApiBase } from './fetchHelper'
import { KRC20TokenResponse } from '@/utils/interfaces'

interface Krc20TokenApiResponse {
  message: string
  result: {
    tick: string
    max: string
    lim: string
    pre: string
    to: string
    dec: string
    minted: string
    opScoreAdd: string
    opScoreMod: string
    state: string
    hashRev: string
    mtsAdd: string
    holderTotal: string
    transferTotal: string
    mintTotal: string
    holder: {
      address: string
      amount: string
    }[]
  }[]
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

    if (response.status === 204) {
      throw new Error(
        `Error 204: cannot get KRC20 token info from Kasplex API. If you're using security software like a VPN, disable advanced protection or turn it off and restart your computer.`,
      )
    } else if (response.data.result.length > 0) {
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
    }

    return null
  } catch (error: any) {
    console.error(`Error fetching token info for ${ticker}:`, error)
    throw new Error(JSON.stringify(error) || 'Unexpected error fetching token info.')
  }
}
