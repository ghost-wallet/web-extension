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

// Cryptos: Combines Kaspa with KRC20 Tokens
export interface Token {
  tick: string
  opScoreMod: string
  balance: number
  dec: number
  floorPrice: number
}

// Kasplex & KRC20
export interface KRC20TokenList {
  result: Token[]
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

// KAS.FYI
export interface KasFyiToken {
  price?: {
    floorPrice?: number
  }
}

export interface KRC20MintEstimateResult {
  totalFees: string
  mintFees: string
  extraNetworkFees: string
  serviceFee: string
  commitTotal: string
}
