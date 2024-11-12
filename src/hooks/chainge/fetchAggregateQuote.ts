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
  options: { signal?: AbortSignal } = {},
): Promise<ChaingeAggregateQuote | undefined> => {
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
      signal: options.signal,
    })

    if (response.data.code === 0 && response.data.data) {
      return response.data.data
    } else {
      console.error('Fetch aggregate quote error:', response)
      throw new Error(`Chainge DEX Error: ${response.data.msg || 'Invalid API response'}`)
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
      return undefined
    } else if (axios.isAxiosError(error) && error.response) {
      if (error.response.status >= 500 && error.response.status < 600) {
        console.error(
          `${error.response.status} Error: cannot get aggregate quote from Chainge:`,
          error.response,
        )
        throw new Error(
          `${error.response.status} Error: Chainge DEX is down or unavailable. Please try again later.`,
        )
      } else {
        console.error('API error:', error.response)
        throw new Error(`${error.response.status} Unknown error: ${error.response.statusText}`)
      }
    } else {
      console.error('Error fetching Chainge tokens:', error)
    }
    throw new Error(`${error instanceof Error ? error.message : error}`)
  }
}
