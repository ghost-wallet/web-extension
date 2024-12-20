import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { sortChaingeTokens } from '@/utils/sorting'
import { unsupportedChaingeTokens } from '@/utils/constants/constants'
import { KAS_TICKER } from '@/utils/constants/tickers'

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

export function useChaingeTokens() {
  return useQuery({
    queryKey: ['chaingeTokens'],
    queryFn: fetchChaingeTokens,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })
}

const fetchChaingeTokens = async (): Promise<ChaingeToken[]> => {
  try {
    const response = await axios.get<{ code: number; msg: string; data: ChaingeTokensList }>(API_URL, {
      params: { chain: KAS_TICKER },
    })

    if (response.data.code === 0 && response.data.data?.list) {
      let tokenList = response.data.data.list.filter(
        (token) => token.krc20Tradeable && !unsupportedChaingeTokens.includes(token.symbol),
      )

      // Sort the tokens according to the priority order
      tokenList = sortChaingeTokens(tokenList)

      return tokenList
    } else {
      throw new Error('Invalid API response')
    }
  } catch (error) {
    console.error('Error fetching Chainge tokens from primary API:', error)
    throw error
  }
}
