import { createContext } from 'react'
import { IKaspa } from './types'
import { RequestMappings, ResponseMappings } from '@/wallet/messaging/messageMappings'
import { Status } from '@/wallet/kaspa/wallet'

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connected: false,
  addresses: [],
  balance: 0,
  utxos: [],
  provider: '',
}

export const KaspaContext = createContext<
  | {
      load: () => Promise<void>
      kaspa: IKaspa
      request: <M extends keyof RequestMappings>(
        method: M,
        params: RequestMappings[M],
      ) => Promise<ResponseMappings[M]>
    }
  | undefined
>(undefined)
