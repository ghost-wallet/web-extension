import { IKaspa, Action } from './types'

export function kaspaReducer(state: IKaspa, action: Action<keyof IKaspa>): IKaspa {
  const { type, payload } = action

  console.log('KASPA REDUCER', state, action)

  if (typeof payload === 'function') {
    return { ...state, [type]: payload(state) }
  } else {
    return { ...state, [type]: payload }
  }
}
