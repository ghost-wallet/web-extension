import { Status } from '../kaspa/wallet'
import { UTXO } from '../kaspa/account/account'
import { CustomInput } from '../kaspa/account/transactions'
import { PriorityBuckets } from '../kaspa/node'
import { Token } from '@/contexts/kasplex/kasplexReducer'

export interface RequestMappings {
  'wallet:status': []
  'wallet:createMnemonic': []
  'wallet:import': [string, string] // Mnemo, Password
  'wallet:unlock': [string] // Password
  'wallet:export': [string] // Password
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
  'account:create': [[string, string][], number, string, CustomInput[]?]
  'account:sign': [string[]]
  'account:submitContextful': [string[]]
  'account:compoundUtxos': []
  'account:scan': []
  'account:writeInscription': [string, Token, string, number]
  'provider:connect': [string]
  'provider:connection': []
  'provider:disconnect': []
}

export interface Request<M extends keyof ResponseMappings = keyof ResponseMappings> {
  id: number
  method: M
  params: RequestMappings[M]
}

export interface ResponseMappings {
  'wallet:status': Status
  'wallet:createMnemonic': string
  'wallet:import': void
  'wallet:unlock': string // Updated to return a string (decrypted key)
  'wallet:export': string
  'wallet:lock': void
  'wallet:reset': void
  'wallet:validate': boolean // Added wallet:validate response
  'node:connect': void
  'node:connection': boolean
  'node:priorityBuckets': PriorityBuckets
  'node:submit': string[]
  'account:addresses': [string[], string[]]
  'account:balance': number
  'account:utxos': UTXO[]
  'account:create': string[]
  'account:sign': string[]
  'account:submitContextful': string[]
  'account:compoundUtxos': void
  'account:scan': void
  'account:writeInscription': [string, string]
  'provider:connect': void
  'provider:connection': string
  'provider:disconnect': void
}

export interface Response<M extends keyof RequestMappings = keyof RequestMappings> {
  id: number
  result: ResponseMappings[M] | undefined
  error?: string
}

export interface EventMappings {
  'wallet:status': Status
  'node:connection': boolean
  'node:network': string
  'account:balance': number
  'account:addresses': [string[], string[]]
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
