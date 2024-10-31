// Kaspa WASM Requests & Responses
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

export interface TokenFromApi {
  tick: string
  opScoreMod: string
  balance: string
  dec: string
}

export interface KaspaToken {
  isKaspa: true
  tick: 'KASPA'
  balance: number
  dec: number
  floorPrice: number
}

/**
 * Requests and responses for using Kaspa API. Official documentation:
 * https://api.kaspa.org
 */
export interface KaspaTransactionList {
  result: KaspaTransaction[]
}

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

/**
 * Our own interface for building token data to account for Kaspa (Kaspa is not a KRC20 token).
 */
export interface Token extends TokenFromApi {
  floorPrice: number
  isKaspa?: undefined
}

/**
 * Requests and responses for using Kasplex API. Official documentation:
 * https://docs.kasplex.org
 */
export interface KRC20TokenList {
  result: TokenFromApi[]
  next: string | null
}

export interface KRC20Transaction {
  op: string
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

export interface KRC20MintEstimateResult {
  totalFees: string
  mintFees: string
  extraNetworkFees: string
  serviceFee: string
  commitTotal: string
}

/**
 * KRC-20 token response from the Kasplex Indexer API. Official documentation:
 * https://docs.kasplex.org/tools-and-reference/kasplex-indexer-api/krc-20/get-krc-20-info
 */
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
  state: string
  hashRev: string
  mtsAdd: string
  holderTotal: number
  transferTotal: number
  mintTotal: number
}

/**
 * Requests and responses for using Kas.FYI API. They don't have official documentation.
 * https://api-v2-do.kas.fyi and https://kas.fyi
 */
export interface KasFyiToken {
  price?: {
    floorPrice?: number
  }
}
