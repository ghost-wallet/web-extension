import { signMessage } from '@/wasm/kaspa'
import { defineProxyService } from '@webext-core/proxy-service'
import { AggregateQuoteResponse } from '@chainge/api-tool-sdk'
import { formatUnits, hexlify, keccak256, parseUnits, toUtf8Bytes } from 'ethers'
import BigNumber from 'bignumber.js'
import AccountAddresses from '../account/AccountAddresses'
import KeyManager from '../account/KeyManager'
import KRC20Transactions from '../krc20/KRC20Transactions'

function sortParams(params: Record<string, any>, evmAddress: string) {
  let keys = Object.keys(params)
  if(!keys.length) return undefined
  keys = keys.sort();
  const keyValList = []
  for (const key of keys) {
      const val = params[key];
      if(val) {
          keyValList.push(`${key}=${val}`)
      }
  }
  const data = keyValList.join('&')
  const raw = `Address=${evmAddress}&${data}`
  return raw
}

export interface ChaingeToken {
  index: number
  name: string
  symbol: string
  decimals: number
  contractAddress: string
  cmcid: number
}

const chaingeMinterAddresses = {
  KAS: 'kaspa:qpgmt2dn8wcqf0436n0kueap7yx82n7raurlj6aqjc3t3wm9y5ssqtg9e4lsm',
  KRC20: 'kaspa:qz9cqmddjppjyth8rngevfs767m5nvm0480nlgs5ve8d6aegv4g9xzu2tgg0u',
  other: 'kaspa:qpy03sxk3z22pacz2vkn2nrqeglvptugyqy54xal2skha6xh0cr7wjueueg79',
} as const

const API_SUBMIT_ORDER_URL = 'https://api2.chainge.finance/v1/submitOrder'

const EXECUTION_CHAIN_NICKNAME = 'KAS'

export default class Chainge {
  constructor(
    private addresses: AccountAddresses,
    private krc20Transaction: KRC20Transactions,
  ) {
    //super()
  }

  async doChaingeOrder(
    fromAmount: string,
    fromToken: ChaingeToken,
    toToken: ChaingeToken,
    quote: Pick<
      AggregateQuoteResponse,
      'chain' | 'chainDecimal' | 'outAmount' | 'serviceFee' | 'gasFee' | 'slippage'
    >,
  ) {
    //const amount = parseUnits(fromAmount, fromToken.decimals).toString()
    const channelFeeRate = '0'

    const fromAddress = this.addresses.receiveAddresses[0]

    if (!this.addresses.publicKey) {
      throw new Error('public key not available')
    }
    const publicKey = this.addresses.publicKey.receivePubkeyAsString(0)

    const { chain, chainDecimal, outAmount, serviceFee, gasFee, slippage } = quote
    const receiveAmount = BigInt(outAmount) - BigInt(serviceFee) - BigInt(gasFee)
    if (receiveAmount <= BigInt(0)) {
      throw 'The current quote amount cannot cover the fees. Please enter a larger amount.'
    }

    // Calculate the value the user should receive.
    const receiveAmountHr = formatUnits(receiveAmount, chainDecimal)
    const receiveAmountForExtra = parseUnits(receiveAmountHr, chainDecimal).toString()

    // Computed minimum, After calculating the minimum value, we need to convert it to the decimals of the target chain.
    const miniAmount = BigNumber(receiveAmountHr)
      .multipliedBy(BigNumber(1 - Number(slippage) * 0.01))
      .toString()
    const miniAmountForExtra = parseUnits(miniAmount, chainDecimal).toString()

    // 1_Expected value;2_Third party profit ratio;3_version;4_Mini Amount;5_Execution chain
    const extra = `1_${receiveAmountForExtra};2_${channelFeeRate};3_2;4_${miniAmountForExtra};5_${'KAS'}`

    const sourceCertsObj = {
      fromAmount,
      fromIndex: fromToken.index,
      fromChain: 'KAS',
      fromAddr: fromAddress,
      certHash: tradeHash,
      fromPublicKey: this.addresses.publicKey.receivePubkeyAsString(0),
      signature: '123456',
    }
    const sourceCertsStr = JSON.stringify(sourceCertsObj)
    let sourceCertsHex = hexlify(toUtf8Bytes(sourceCertsStr))
    sourceCertsHex = sourceCertsHex.substring(2)

    const params = {
      sourceCerts: sourceCertsHex,
      orderType: '2',
      toIndex: toToken.index,
      toChain: 'KAS',
      toAddr: fromAddress,
      slippage: slippage,
      execStrategy: '',
      extra: extra,
      triggerPrice: '0',
      timeout: '0',
      channel: 'chainge',
    }
    const freezeParams = Object.freeze(params)
    let raw = sortParams(freezeParams, fromAddress)
    raw = keccak256(hexlify(toUtf8Bytes(raw!)))

    const keyGenerator = KeyManager.createKeyGenerator()
    const privateKey = keyGenerator.receiveKey(0)
    const signature = signMessage({message: raw, privateKey})

    const header = {
      Address: fromAddress,
      PublicKey: publicKey,
      Chain: 'KAS',
      Signature: signature,
    }

    const response = await fetch('https://api2.chainge.finance/v1/submitOrder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...header,
      },
      body: JSON.stringify(params),
    })
    const result = await response.json()

    return result
  }
}

export const [registerChaingeService, getChaingeService] = defineProxyService(
  'ChaingeService',
  (addresses: AccountAddresses, krc20Transactions: KRC20Transactions) =>
    new Chainge(addresses, krc20Transactions),
)
