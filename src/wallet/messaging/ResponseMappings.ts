import { Status } from '@/utils/constants/constants'
import { KRC20TokenRequest, UTXO } from '@/types/interfaces'
import { PriorityBuckets } from '../Node'
import { ChaingeOrderResponse } from '../exchange/chainge'

export interface ResponseMappings {
  'wallet:status': Status
  'wallet:createMnemonic': string
  'wallet:import': void
  'wallet:unlock': string
  'wallet:export': string
  'wallet:lock': void
  'wallet:reset': void
  'wallet:validate': boolean
  'node:connect': void
  'node:connection': boolean
  'node:priorityBuckets': PriorityBuckets
  'node:submit': string[]
  'account:addresses': string[]
  'account:balance': number
  'account:utxos': UTXO[]
  'account:estimateKaspaTransactionFee': string
  'account:create': [string[], string]
  'account:sign': string[]
  'account:submitContextful': string[]
  'account:submitKaspaTransaction': string[]
  'account:getKRC20Info': KRC20TokenRequest
  'account:submitKRC20Transaction': [string, string]
  'account:estimateKRC20TransactionFee': string
  'provider:connect': void
  'provider:connection': string
  'provider:disconnect': void
  'account:submitChaingeOrder': ChaingeOrderResponse
  'account:estimateChaingeTransactionFee': string
}

export interface Response<M extends keyof ResponseMappings = keyof ResponseMappings> {
  id: number
  result: ResponseMappings[M] | undefined
  error?: string
}
