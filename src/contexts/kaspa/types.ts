import { Request, RequestMappings } from '@/wallet/messaging/RequestMappings'
import { ResponseMappings } from '@/wallet/messaging/ResponseMappings'
import { Status } from '@/wallet/Wallet'
import { UTXO } from '@/utils/interfaces'

//TODO: connected field should not have network strings, but something is setting those to become strings
// it should only be true or false
export interface IKaspa {
  status: Status
  connected: boolean | 'mainnet' | 'testnet-10' | 'testnet-11'
  addresses: string[]
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
