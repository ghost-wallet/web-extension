import axios from 'axios'

interface Operation {
  op: string
  tick: string
  amt: string
  from: string
  to: string
  opScore: string
  hashRev: string
  mtsAdd: string
}

interface ApiResponse {
  message: string
  prev: string | null
  next: string | null
  result: Operation[]
}

interface FetchOperationsParams {
  address: string
  apiBase: string
  tick?: string
  next?: string
  prev?: string
}

export const fetchOperations = async ({
  address,
  apiBase,
  tick,
  next,
  prev,
}: FetchOperationsParams): Promise<ApiResponse> => {
  try {
    const params = new URLSearchParams()
    params.append('address', address)
    if (tick) {
      params.append('tick', tick)
    }
    if (next) {
      params.append('next', next)
    }
    if (prev) {
      params.append('prev', prev)
    }

    const response = await axios.get<ApiResponse>(
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
