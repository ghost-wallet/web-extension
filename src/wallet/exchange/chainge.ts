import { signMessage } from '@/wasm/kaspa'
import { AggregateQuoteResponse, Chain } from '@chainge/api-tool-sdk'
import { formatUnits, hexlify, keccak256, parseUnits, toUtf8Bytes } from 'ethers'
import BigNumber from 'bignumber.js'
import AccountAddresses from '../account/AccountAddresses'
import KeyManager from '../account/KeyManager'
import KRC20Transactions from '../krc20/KRC20Transactions'
import AccountTransactions from '../account/AccountTransactions'
import axios from 'axios'

function sortParams(params: Record<string, any>, evmAddress: string) {
  let keys = Object.keys(params)
  if (!keys.length) return undefined
  keys = keys.sort()
  const keyValList = []
  for (const key of keys) {
    const val = params[key]
    if (val) {
      keyValList.push(`${key}=${val}`)
    }
  }
  const data = keyValList.join('&')
  return `Address=${evmAddress}&${data}`
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

export interface SubmitChaingeOrderRequest {
  fromAmount: string
  fromToken: ChaingeToken
  toToken: ChaingeToken
  quote: Pick<
    AggregateQuoteResponse,
    'chain' | 'chainDecimal' | 'outAmount' | 'serviceFee' | 'gasFee' | 'slippage'
  >
  feeRate: number
}

interface ChaingeResponse<T> {
  code: number
  data: T
  msg: string
}

export type ChaingeOrderResponse = ChaingeResponse<{ id: string }>

export default class Chainge {
  constructor(
    private addresses: AccountAddresses,
    private transactions: AccountTransactions,
    private krc20Transactions: KRC20Transactions,
  ) {
    //super()
  }

  async getChaingeSupportedChains() {
    const { data } = await axios.get<ChaingeResponse<{ version: number; list: Chain[] }>>(
      'https://api2.chainge.finance/v1/getChain',
    )
    return data.data.list
  }

  async submitChaingeOrder({ fromAmount, fromToken, toToken, quote, feeRate }: SubmitChaingeOrderRequest) {
    console.log('[Chainge] submit', { fromAmount, fromToken, toToken, quote, feeRate })

    const amount = parseUnits(fromAmount, fromToken.decimals).toString()

    console.log('[Chainge] amount', amount)

    const channelFeeRate = '0'

    const fromAddress = this.addresses.receiveAddresses[0]

    if (!this.addresses.publicKey) {
      throw new Error('public key not available')
    }
    const publicKey = this.addresses.publicKey.receivePubkeyAsString(0)

    const { chain, chainDecimal, outAmount, serviceFee, gasFee, slippage } = quote
    const receiveAmount = BigInt(outAmount) - BigInt(serviceFee) - BigInt(gasFee)
    console.log('[Chainge] receiveAmount', receiveAmount.toString())
    if (receiveAmount <= BigInt(0)) {
      throw 'The current quote amount cannot cover the fees. Please enter a larger amount.'
    }

    // Calculate the value the user should receive.
    const receiveAmountHr = formatUnits(receiveAmount, chainDecimal)
    const receiveAmountForExtra = parseUnits(receiveAmountHr, toToken.decimals).toString()

    console.log('[Chainge] receiveAmountHr', receiveAmountHr)
    console.log('[Chainge] receiveAmountForExtra', receiveAmountForExtra)

    // Computed minimum, After calculating the minimum value, we need to convert it to the decimals of the target chain.
    const miniAmount = BigNumber(receiveAmountHr)
      .multipliedBy(BigNumber(1 - parseFloat(slippage) * 0.01))
      .decimalPlaces(toToken.decimals, BigNumber.ROUND_FLOOR)
      .toString()
    const miniAmountForExtra = parseUnits(miniAmount, toToken.decimals).toString()

    console.log('[Chainge] miniAmount', miniAmount)
    console.log('[Chainge] miniAmountForExtra', miniAmountForExtra)

    const supportChainList = await this.getChaingeSupportedChains() // TODO cache this
    console.log('[Chainge] supportChainList', supportChainList)

    const executionChainObj = supportChainList.find((item) => item.network === chain)
    console.log('[Chainge] executionChainObj', executionChainObj)

    if (!executionChainObj) {
      throw new Error("Couldn't find the execution chain!")
    }

    // 1_Expected value;2_Third party profit ratio;3_version;4_Mini Amount;5_Execution chain
    const extra = `1_${receiveAmountForExtra};2_${channelFeeRate};3_2;4_${miniAmountForExtra};5_${executionChainObj.nickName}`

    console.log('[Chainge] extra', extra)

    const transactionId = await this.sendChaingeTransaction(fromAmount, fromToken, feeRate)

    console.log('[Chainge] transactionId', transactionId)

    const sourceCertsObj = {
      fromAmount: amount,
      fromIndex: fromToken.index.toString(),
      fromChain: 'KAS',
      fromAddr: fromAddress,
      certHash: transactionId,
      fromPublicKey: this.addresses.publicKey.receivePubkeyAsString(0),
      signature: '123456',
    }

    console.log('[Chainge] sourceCertsObj', sourceCertsObj)

    const sourceCertsStr = JSON.stringify(sourceCertsObj)

    console.log('[Chainge] sourceCertsStr', sourceCertsStr)

    let sourceCertsHex = hexlify(toUtf8Bytes(sourceCertsStr))

    console.log('[Chainge] sourceCertsHex', sourceCertsHex)

    sourceCertsHex = sourceCertsHex.substring(2)

    console.log('[Chainge] sourceCertsHex', sourceCertsHex)

    const slippageFormat = (Number(slippage) * 100).toFixed(0)

    const params = {
      sourceCerts: sourceCertsHex,
      orderType: '2',
      toIndex: toToken.index.toString(),
      toChain: 'KAS',
      toAddr: fromAddress,
      slippage: slippageFormat.toString(),
      execStrategy: '',
      extra: extra,
      triggerPrice: '0',
      timeout: '0',
      channel: 'chainge',
    }

    console.log('[Chainge] params', params)

    const freezeParams = Object.freeze(params)
    let raw = sortParams(freezeParams, fromAddress)

    console.log('[Chainge] raw', raw)

    raw = keccak256(hexlify(toUtf8Bytes(raw!)))

    console.log('[Chainge] raw', raw)

    const keyGenerator = KeyManager.createKeyGenerator()
    const privateKey = keyGenerator.receiveKey(0)
    const signature = signMessage({ message: raw, privateKey })

    console.log('[Chainge] signature', signature)

    const header = {
      Address: fromAddress,
      PublicKey: publicKey,
      Chain: 'KAS',
      Signature: signature,
    }

    console.log('[Chainge] header', header)

    const response = await axios.post<ChaingeOrderResponse>(API_SUBMIT_ORDER_URL, params, {
      headers: {
        'Content-Type': 'application/json',
        ...header,
      },
    })

    console.log('[Chainge] response', response)
    console.log('[Chainge] response.data', response.data)

    return response.data
  }

  private async sendChaingeTransaction(fromAmount: string, fromToken: ChaingeToken, feeRate: number) {
    console.log('[Chainge] sendChaingeTransaction', { fromAmount, fromToken, feeRate })
    if (fromToken.contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      // KAS
      const [transactions] = await this.transactions.create(
        [[chaingeMinterAddresses.KAS, fromAmount]],
        feeRate,
        '0',
      )
      console.log('[Chainge] transactions', transactions)
      const submittedTransactions = await this.transactions.submitKaspaTransaction(transactions)
      console.log('[Chainge] submittedTransactions', submittedTransactions)
      return submittedTransactions[submittedTransactions.length - 1]
    } else {
      // KRC-20
      const toAddress = ['CUSDT', 'CUSDC', 'CETH', 'CBTC', 'CXCHNG'].includes(fromToken.contractAddress)
        ? chaingeMinterAddresses.other
        : chaingeMinterAddresses.KRC20

      const krc20Token = {
        tick: fromToken.contractAddress,
        dec: fromToken.decimals,
      }

      const info = await this.krc20Transactions.getKRC20Info(toAddress, krc20Token, fromAmount)
      console.log('[Chainge] info', info)
      const [commitId, revealId] = await this.krc20Transactions.submitKRC20Transaction(info, feeRate)
      console.log('[Chainge] revealId', revealId)
      return revealId
    }
  }
}
