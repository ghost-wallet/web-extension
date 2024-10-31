import axios from 'axios'
import { KaspaTransactionList } from '@/utils/interfaces'

export const fetchKaspaTransactionHistory = async (
  address: string,
  limit: number | null = null,
  offset: number | null = null,
): Promise<KaspaTransactionList> => {
  try {
    const params = new URLSearchParams()
    if (limit) {
      params.append('limit', limit.toString())
    }
    if (offset) {
      params.append('offset', offset.toString())
    }
    const response = await axios.get<KaspaTransactionList>(
      `https://api.kaspa.org/addresses/${address}/full-transactions?${params.toString()}`,
    )

    if (response.data) {
      console.log('returning response.data', response.data)
      return response.data
    } else {
      throw new Error('Error fetching Kaspa transactions. Invalid API response structure')
    }
  } catch (error) {
    console.error('Error fetching Kaspa transactions:', error)
    throw error
  }
}
