export const FEE_TYPES = ['slow', 'standard', 'fast'] as const

export const KRC20_COMMIT_AMOUNT = '1' as const

export const MAX_MARKET_CAP_THRESHOLD = 500_000_000 // 500 million

export const unsupportedChaingeTokens = ['USDC', 'BTC', 'ETH', 'XCHNG', 'RTO']

export const chaingeMinterAddresses = {
  KAS: 'kaspa:qpgmt2dn8wcqf0436n0kueap7yx82n7raurlj6aqjc3t3wm9y5ssqtg9e4lsm',
  KRC20: 'kaspa:qz9cqmddjppjyth8rngevfs767m5nvm0480nlgs5ve8d6aegv4g9xzu2tgg0u',
  other: 'kaspa:qpy03sxk3z22pacz2vkn2nrqeglvptugyqy54xal2skha6xh0cr7wjueueg79',
}

export enum Status {
  Uninitialized,
  Locked,
  Unlocked
}

