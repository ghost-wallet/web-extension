import axios from 'axios'
import { ChaingeToken } from '@/hooks/chainge/useChaingeTokens'

export interface ChaingeAggregateQuote {
  chain: string
  chainDecimal: number
  aggregator: string
  outAmount: string
  outAmountUsd: string
  minOutAmount?: string
  serviceFee: string
  gasFee: string
  priceImpact: string
  routeSummary: string
  slippage: string
}

const API_URL = 'https://api2.chainge.finance/v1/getAggregateQuote'

export const fetchAggregateQuote = async (
  fromToken: ChaingeToken,
  toToken: ChaingeToken,
  fromAmount: number,
): Promise<ChaingeAggregateQuote> => {
  try {
    const response = await axios.get<{ code: number; msg: string; data: ChaingeAggregateQuote }>(API_URL, {
      params: {
        fromAmount,
        fromTokenAddress: fromToken.contractAddress,
        fromDecimal: fromToken.decimals,
        fromChain: 'KAS',
        toTokenAddress: toToken.contractAddress,
        toDecimal: toToken.decimals,
        toChain: 'KAS',
      },
    })

    if (response.data.code === 0 && response.data.data) {
      return response.data.data
    } else {
      throw new Error(`Error fetching Chainge tokens: ${response.data.msg || 'Invalid API response'}`)
    }
  } catch (error) {
    console.error('Error fetching Chainge tokens:', error)
    throw new Error(`Failed to fetch Chainge tokens: ${error instanceof Error ? error.message : error}`)
  }
}
