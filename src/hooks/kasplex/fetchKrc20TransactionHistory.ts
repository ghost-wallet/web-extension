import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'
import { KRC20TransactionList } from '@/utils/interfaces'

export const fetchKRC20TransactionHistory = async (
  selectedNode: number,
  address: string,
  next: string | null = null,
  tick: string | null = null,
): Promise<KRC20TransactionList> => {
  try {
    const params = new URLSearchParams()
    params.append('address', address)
    if (next) {
      params.append('next', next)
    }
    if (tick) {
      params.append('tick', tick)
    }
    const apiBase = getApiBase(selectedNode)
    const response = await axios.get<KRC20TransactionList>(
      `https://${apiBase}.kasplex.org/v1/krc20/oplist?${params.toString()}`,
    )

    if (response.data && response.data.result) {
      return response.data
    } else {
      throw new Error('Error fetching KRC20 operations. Invalid API response structure')
    }
  } catch (error) {
    console.error('Error fetching operations:', error)
    throw error
  }
}
