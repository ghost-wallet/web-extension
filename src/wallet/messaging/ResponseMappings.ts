import { Status } from '../Wallet'
import { KRC20MintEstimateResult, KRC20TokenRequest, UTXO } from '@/utils/interfaces'
import { PriorityBuckets } from '../Node'

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
  'account:doKRC20Mint': string[]
  'account:estimateKRC20MintFees': KRC20MintEstimateResult
  'provider:connect': void
  'provider:connection': string
  'provider:disconnect': void
}

export interface Response<M extends keyof ResponseMappings = keyof ResponseMappings> {
  id: number
  result: ResponseMappings[M] | undefined
  error?: string
}
