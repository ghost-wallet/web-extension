// Kaspa
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

// KRC20 and Kasplex
export interface KRC20Transaction {
  op: string
  tick: string
  amt: string
  from: string
  to: string
  opScore: string
  hashRev: string
  mtsAdd: string
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
  lim: string
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
