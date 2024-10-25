import axios from 'axios'
import { getApiBase } from '@/hooks/kasplex/fetchHelper'

export interface Transaction {
  op: string
  tick: string
  amt: string
  from: string
  to: string
  opScore: string
  hashRev: string
  mtsAdd: string
}

export interface Transactions {
  message: string
  prev: string | null
  next: string | null
  result: Transaction[]
}

//TODO cache transaction history
export const fetchKRC20TransactionHistory = async (
  selectedNode: number,
  address: string,
  next: string | null = null,
): Promise<Transactions> => {
  try {
    const params = new URLSearchParams()
    params.append('address', address)
    if (next) {
      params.append('next', next)
    }
    const apiBase = getApiBase(selectedNode)
    const response = await axios.get<Transactions>(
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
