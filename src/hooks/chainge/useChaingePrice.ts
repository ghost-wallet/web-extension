import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'

const API_URL = 'https://api2.chainge.finance/v1/getPrice'

export interface ChaingePriceResponse {
  code: number
  msg: string
  data: {
    price: string
    updateTime: number
    source: string
  }
}

const fetchChaingePrice = async (token: ChaingeToken | null): Promise<ChaingePriceResponse> => {
  try {
    const response = await axios.get<ChaingePriceResponse>(API_URL, {
      params: {
        chain: 'KAS',
        contractAddress: token?.contractAddress,
        symbol: token?.symbol,
      },
    })
    return response.data
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.msg || `Error getting token price from Chainge for ${token?.symbol}`,
    )
  }
}

export default function useChaingePrice(token: ChaingeToken | null) {
  return useQuery({
    queryKey: ['chaingePrice', token?.symbol],
    queryFn: () => fetchChaingePrice(token),
    enabled: !!token,
  })
}
