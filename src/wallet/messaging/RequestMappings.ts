import { Status } from '@/utils/constants/constants'
import { CustomInput, KRC20TokenRequest } from '@/types/interfaces'
import { Token } from '@/wallet/krc20/KRC20Transactions'
import { ChaingeFeeEstimateRequest, SubmitChaingeOrderRequest } from '../exchange/chainge'

export interface RequestMappings {
  'wallet:status': []
  'wallet:createMnemonic': []
  'wallet:import': [string, string]
  'wallet:unlock': [string]
  'wallet:export': [string]
  'wallet:lock': []
  'wallet:reset': []
  'wallet:validate': [string] // Address
  'node:connect': [string]
  'node:connection': []
  'node:priorityBuckets': []
  'node:submit': [string[]]
  'account:addresses': []
  'account:balance': []
  'account:utxos': []
  'account:estimateKaspaTransactionFee': [[string, string][], number, string]
  'account:create': [[string, string][], number, string, CustomInput[]?]
  'account:sign': [string[]]
  'account:submitContextful': [string[]]
  'account:submitKaspaTransaction': [string[]]
  'account:getKRC20Info': [string, Token, string]
  'account:submitKRC20Transaction': [KRC20TokenRequest, number]
  'account:estimateKRC20TransactionFee': [KRC20TokenRequest, number]
  'provider:connect': [string]
  'provider:connection': []
  'provider:disconnect': []
  'account:submitChaingeOrder': [SubmitChaingeOrderRequest]
  'account:estimateChaingeTransactionFee': [ChaingeFeeEstimateRequest]
}

export interface Request<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export interface EventMappings {
  'wallet:status': Status
  'node:connection': boolean
  'node:network': string
  'account:balance': number
  'account:addresses': string[]
  'provider:connection': string
}

export interface EventMessage<M extends keyof EventMappings = keyof EventMappings> {
  event: M
  data: EventMappings[M]
}

export type Event<M extends keyof EventMappings = keyof EventMappings> = {
  [K in M]: EventMessage<K>
}[M]

export function isEvent(message: any): message is Event {
  return message && typeof message.event === 'string' && typeof message.data !== 'undefined'
}
