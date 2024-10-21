export interface Token {
  tick: string
  balance: string
  opScoreMod: string
  dec: string
  floorPrice?: number
}

export interface IKasplex {
  tokens: Token[]
  loading: boolean
  error: string | null
}

export const defaultState: IKasplex = {
  tokens: [],
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
