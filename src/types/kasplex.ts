
export type Krc20TokenState = 'deployed' | 'finished' | 'unused' | 'ignored' | 'reserved'

// Get KRC-20 Token List
// https://docs.kasplex.org/tools-and-reference/kasplex-indexer-api/krc-20/get-krc-20-token-list
// https://api.kasplex.org/v1/krc20/tokenlist

export interface Krc20TokenListResponse {
  result: Krc20TokenItemFromListApi[]
  next: string
  prev: string
  message: string
}

export interface Krc20TokenItemFromListApi {
  tick: string
  max: string
  lim: string
  pre: string
  to: string
  dec: string
  minted: string
  opScoreAdd: string
  opScoreMod: string
  state: Krc20TokenState
  hashRev: string
  mtsAdd: string
}

// Get KRC-20 Info
// https://docs.kasplex.org/tools-and-reference/kasplex-indexer-api/krc-20/get-krc-20-info
// https://api.kasplex.org/v1/krc20/token/{tick}

export interface Krc20TokenInfoResponse {
  result: Krc20TokenItemFromApi[]
  message: string
}

export interface Krc20TokenItemFromApi {
  tick: string
  max: string
  lim: string
  pre: string
  to: string
  dec: string
  minted: string
  opScoreAdd: string
  opScoreMod: string
  state: Krc20TokenState
  hashRev: string
  mtsAdd: string
  holderTotal: string
  transferTotal: string
  mintTotal: string
  holder: {
    address: string
    amount: string
  }[]
}

// Get KRC20 Address Token List
// https://docs.kasplex.org/tools-and-reference/kasplex-indexer-api/krc-20/get-krc20-address-token-list
// https://api.kasplex.org/v1/krc20/address/{address}/tokenlist

export interface Krc20AddressTokenListResponse {
  result: Krc20AccountTokenFromApi[]
  next: string
  prev: string
  message: string
}

export interface Krc20AccountTokenFromApi {
  tick: string
  balance: string
  locked: '0'
  dec: string
  opScoreMod: string
}