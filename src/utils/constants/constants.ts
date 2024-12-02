export const FEE_TYPES = ['slow', 'standard', 'fast'] as const
export const MINIMUM_KAS_FOR_GAS_FEE = 1

export const KRC20_COMMIT_AMOUNT = '1' as const

// TODO put back to 5.0 when done testing
export const MINIMUM_RECEIVE_AMOUNT_USD = 5.0
export const unsupportedChaingeTokens = ['USDC', 'BTC', 'ETH', 'XCHNG', 'RTO']
export const chaingeMinterAddresses = {
  KAS: 'kaspa:qpgmt2dn8wcqf0436n0kueap7yx82n7raurlj6aqjc3t3wm9y5ssqtg9e4lsm',
  KRC20: 'kaspa:qz9cqmddjppjyth8rngevfs767m5nvm0480nlgs5ve8d6aegv4g9xzu2tgg0u',
  other: 'kaspa:qpy03sxk3z22pacz2vkn2nrqeglvptugyqy54xal2skha6xh0cr7wjueueg79',
}

export enum Status {
  Uninitialized,
  Locked,
  Unlocked,
}

export const MINT_SERVER_START_TIME = 80
export const MINT_PER_TXN = 2
export const MAX_ALLOWED_MINTS = 200
export const MIN_ALLOWED_MINTS = 5
