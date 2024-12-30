import { Krc20AccountTokenFromApi, Krc20TokenState } from "./kasplex"

/**
 * Requests and responses for WASM. Official documentation:
 * https://api.kaspa.org
 */
export interface UTXO {
  amount: number
  transaction: string
  mature: boolean
}

export interface CustomInput {
  address: string
  outpoint: string
  index: number
}

export interface CustomSignature {
  outpoint: string
  index: number
  signer: string
  script?: string
}

/**
 * Requests and responses for using Kaspa API. Official documentation:
 * https://api.kaspa.org
 */
export type KaspaTransactionList = KaspaTransaction[]

export interface KaspaTransaction {
  transaction_id: string
  block_time: number
  outputs: KaspaTransactionOutput[]
}

export interface KaspaTransactionOutput {
  transaction_id: string
  index: number
  amount: number
  script_public_key_address: string
}



export interface AccountKaspaToken {
  isKaspa: true
  tick: 'KASPA'
  balance: number
  dec: number
  floorPrice: number
//  isHidden?: boolean
}


export interface AccountTokenWithPrices extends Krc20AccountTokenFromApi {
  isKaspa?: undefined
  floorPrice: number
  volume24h: number
  rank: number
}

export type AccountToken = AccountKaspaToken | AccountTokenWithPrices


export interface KRC20TokenList {
  result: KRC20TokenItemFromListApi[]
  next: string | null
}

export interface KRC20TokenItemFromListApi {
  tick: string,
  max: string,
  lim: string,
  pre: string,
  to: string,
  dec: string,
  minted: string,
  opScoreAdd: string,
  opScoreMod: string,
  state: string,
  hashRev: string,
  mtsAdd: string
}


export interface KRC20Transaction {
  op: string
  opAccept: string
  tick: string
  amt: string
  from: string
  to: string
  opScore: string
  hashRev: string
  mtsAdd: string
  groupedOperations: KRC20Transaction[]
}

export interface KRC20TransactionList {
  message: string
  prev: string | null
  next: string | null
  result: KRC20Transaction[]
}

export interface KRC20TokenRequest {
  sender: string
  recipient: string
  scriptAddress: string
  script: string
}


export interface KRC20TokenResponse {
  tick: string
  max: number
  lim: number
  pre: number
  to: string
  dec: number
  minted: number
  opScoreAdd: string
  opScoreMod: string
  state: Krc20TokenState
  hashRev: string
  mtsAdd: string
  holderTotal: number
  transferTotal: number
  mintTotal: number
  floorPrice?: number
}

/**
 * Responses for KSPR Bot API.
 */
export interface KsprToken {
  floor_price: number
  change_24h: number
}

export interface KsprTokenResponse {
  [symbol: string]: KsprToken
}

/**
 * Responses for Kas.Fyi
 * https://api.kas.fyi/docs
 */
export interface KasFyiToken {
  ticker: string
  price: {
    kas: number
    usd: number
  }
  volume24h: {
    usd: number
  }
  marketCap: {
    usd: number
  }
  rank: number
}

export interface KasFyiTokenResponse {
  results: KasFyiToken[]
}

export interface SearchToken {
  tick: string
  max: number | string
  minted: number | string
  dec: number | string
  floorPrice?: number
  state: Krc20TokenState
}