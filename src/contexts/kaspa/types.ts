import { Request, RequestMappings, ResponseMappings } from '@/wallet/messaging/messageMappings'
import { Status } from '@/wallet/kaspa/wallet'
import { UTXO } from '@/wallet/kaspa/account/account'

export interface IKaspa {
  status: Status
  connected: boolean
  addresses: [string[], string[]]
  balance: number
  utxos: UTXO[]
  provider: string
}

export interface MessageEntry<M extends keyof RequestMappings> {
  resolve: (value: ResponseMappings[M]) => void
  reject: (reason?: any) => void
  message: Request<M>
}

export type Action<K extends keyof IKaspa> = {
  type: K
  payload: IKaspa[K] | ((oldState: IKaspa) => IKaspa[K])
}
