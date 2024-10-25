import axios from 'axios'
import { sortChaingeTokens } from '@/utils/sorting'

export interface ChaingeToken {
  index: number
  name: string
  symbol: string
  decimals: number
  contractAddress: string
  cmcid: number
  krc20Tradeable?: boolean
}

export interface ChaingeTokensList {
  version: number
  list: ChaingeToken[]
}

const API_URL = 'https://api2.chainge.finance/v1/getAssetsByChain'
const CACHE_KEY = 'chainge_tokens'
const CACHE_TIMESTAMP_KEY = 'chainge_tokens_timestamp'
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export const fetchChaingeTokens = async (): Promise<ChaingeToken[]> => {
  const cachedTokens = localStorage.getItem(CACHE_KEY)
  const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
  const currentTime = Date.now()

  // Check cache and return if valid
  if (cachedTokens && cachedTimestamp && currentTime - parseInt(cachedTimestamp) < CACHE_DURATION) {
    try {
      return JSON.parse(cachedTokens)
    } catch (error) {
      console.error('Error parsing cached Chainge tokens:', error)
    }
  }

  try {
    const response = await axios.get<{ code: number; msg: string; data: ChaingeTokensList }>(API_URL, {
      params: { chain: 'KAS' },
    })

    if (response.data.code === 0 && response.data.data?.list) {
      // Filter tokens based on krc20Tradeable being present and true
      let tokenList = response.data.data.list.filter((token) => token.krc20Tradeable)

      // Sort the tokens according to the priority order
      tokenList = sortChaingeTokens(tokenList)

      // Cache data in localStorage
      localStorage.setItem(CACHE_KEY, JSON.stringify(tokenList))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, currentTime.toString())

      return tokenList
    } else {
      throw new Error('Error fetching Chainge tokens: Invalid API response')
    }
  } catch (error) {
    console.error('Error fetching Chainge tokens:', error)
    throw error
  }
}
