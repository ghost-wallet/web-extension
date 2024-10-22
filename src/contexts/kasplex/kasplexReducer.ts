export interface Token {
  tick: string
  balance: string
  opScoreMod: string
  dec: string
  floorPrice?: number
}

export interface Operation {
  op: string
  tick: string
  amt: string
  from: string
  to: string
  opScore: string
  hashRev: string
  mtsAdd: string
}

export interface ApiResponse {
  message: string
  prev: string | null
  next: string | null
  result: Operation[]
}

export interface IKasplex {
  tokens: Token[]
  operations: ApiResponse
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
    result: [],
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
