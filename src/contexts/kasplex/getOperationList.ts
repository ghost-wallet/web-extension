import axios from 'axios'

interface Operation {
  op: string // Operation type (e.g., transfer)
  tick: string // Token ticker (e.g., KONAN)
  amt: string // Amount transferred
  from: string // Sender address
  to: string // Receiver address
  opScore: string // Operation score
  hashRev: string // Transaction hash
  mtsAdd: string // Timestamp when the operation was added
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
      return response.data // Return the entire ApiResponse object
    } else {
      throw new Error('Error fetching KRC20 operations. Invalid API response structure')
    }
  } catch (error) {
    console.error('Error fetching operations:', error)
    throw error
  }
}
