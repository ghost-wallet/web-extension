import { createContext } from 'react'
import { IKaspa } from './types'
import { RequestMappings } from '@/wallet/messaging/RequestMappings'
import { ResponseMappings } from '@/wallet/messaging/ResponseMappings'
import { Status } from '@/wallet/Wallet'

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
