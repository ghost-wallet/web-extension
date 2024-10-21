export interface Token {
  tick: string
  balance: string
  opScoreMod: string
  dec: string
  floorPrice?: number
}

export interface Operation {
  op: string // Operation type (e.g., transfer)
  tick: string // Token ticker (e.g., KONAN)
  amt: string // Amount transferred
  from: string // Sender address
  to: string // Receiver address
  opScore: string // Operation score
  hashRev: string // Transaction hash
  mtsAdd: string // Timestamp when the operation was added
}

export interface ApiResponse {
  message: string
  prev: string | null
  next: string | null
  result: Operation[]
}

export interface IKasplex {
  tokens: Token[]
  operations: ApiResponse // Change operations to match ApiResponse
  prevCursor: string | null
  nextCursor: string | null
  loading: boolean
  error: string | null
}

export const defaultState: IKasplex = {
  tokens: [],
  operations: {
    message: '',
    prev: null,
    next: null,
    result: [], // Initialize result as an empty array
  },
  prevCursor: null,
  nextCursor: null,
  loading: true,
  error: null,
}

export type Action<K extends keyof IKasplex> = {
  type: K
  payload: IKasplex[K]
}

export function kasplexReducer(state: IKasplex, action: Action<keyof IKasplex>): IKasplex {
  const { type, payload } = action
  return { ...state, [type]: payload }
}
