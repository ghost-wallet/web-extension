import { signMessage } from '@/wasm'
import { AggregateQuoteResponse, Chain } from '@chainge/api-tool-sdk'
import { formatUnits, hexlify, keccak256, parseUnits, toUtf8Bytes } from 'ethers'
import BigNumber from 'bignumber.js'
import AccountAddresses from '../account/AccountAddresses'
import KeyManager from '../account/KeyManager'
import KRC20Transactions from '../krc20/KRC20Transactions'
import AccountTransactions from '../account/AccountTransactions'
import axios from 'axios'
import { chaingeMinterAddresses } from '@/utils/constants/constants'
import { getChaingeTicker } from '@/utils/labels'

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

const API_SUBMIT_ORDER_URL = 'https://api2.chainge.finance/v1/submitOrder'
// const API_POST_ORDER_URL = 'https://0fvftsrgqf.execute-api.us-east-1.amazonaws.com/dev/start-chainge-order' //dev
const API_POST_ORDER_URL = 'https://3hk5khl1vl.execute-api.us-east-1.amazonaws.com/prod/start-chainge-order' //prod

type ChaingeQuote = Omit<AggregateQuoteResponse, 'routeSummary'>

export interface PostChaingeOrderRequest {
  transactionId: string
  walletAddress: string
  payTokenTicker: string
  payAmount: string
  receiveTokenTicker: string
  receiveAmount: string
  receiveAmountUsd: string
  chaingeOrderId: string
  slippage: string
  quote: ChaingeQuote
  serviceFeeUsd: number
  orderTimestamp: number
}

export interface SubmitChaingeOrderRequest {
  fromAmount: string
  fromToken: ChaingeToken
  toToken: ChaingeToken
  quote: ChaingeQuote
  slippage: string
  feeRate: number
  serviceFeeUsd: number
}

export interface ChaingeFeeEstimateRequest {
  fromAmount: string
  fromToken: ChaingeToken
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

  async submitChaingeOrder({
    fromAmount,
    fromToken,
    toToken,
    quote,
    feeRate,
    slippage,
    serviceFeeUsd,
  }: SubmitChaingeOrderRequest) {
    const amount = parseUnits(fromAmount, fromToken.decimals).toString()
    const channelFeeRate = '0'
    const fromAddress = this.addresses.receiveAddresses[0]

    if (!this.addresses.publicKey) {
      throw new Error('public key not available')
    }
    const publicKey = this.addresses.publicKey.receivePubkeyAsString(0)

    const { chain, chainDecimal, outAmount, serviceFee, gasFee } = quote
    const receiveAmount = BigInt(outAmount) - BigInt(serviceFee) - BigInt(gasFee)
    if (receiveAmount <= BigInt(0)) {
      throw 'The current quote amount cannot cover the fees. Please enter a larger amount.'
    }

    // Calculate the value the user should receive.
    const receiveAmountHr = formatUnits(receiveAmount, chainDecimal)
    const receiveAmountForExtra = parseUnits(receiveAmountHr, toToken.decimals).toString()

    // Computed minimum, After calculating the minimum value, we need to convert it to the decimals of the target chain.
    const miniAmount = BigNumber(receiveAmountHr)
      .multipliedBy(BigNumber(1 - parseFloat(slippage) * 0.01))
      .decimalPlaces(toToken.decimals, BigNumber.ROUND_FLOOR)
      .toString()
    const miniAmountForExtra = parseUnits(miniAmount, toToken.decimals).toString()

    const supportChainList = await this.getChaingeSupportedChains() // TODO cache this
    const executionChainObj = supportChainList.find((item) => item.network === chain)
    if (!executionChainObj) {
      throw new Error("Couldn't find the execution chain!")
    }

    // 1_Expected value;2_Third party profit ratio;3_version;4_Mini Amount;5_Execution chain
    const extra = `1_${receiveAmountForExtra};2_${channelFeeRate};3_2;4_${miniAmountForExtra};5_${executionChainObj.nickName}`
    const transactionId = await this.sendChaingeTransaction(fromAmount, fromToken, feeRate)

    const sourceCertsObj = {
      fromAmount: amount,
      fromIndex: fromToken.index.toString(),
      fromChain: 'KAS',
      fromAddr: fromAddress,
      certHash: transactionId,
      fromPublicKey: this.addresses.publicKey.receivePubkeyAsString(0),
      signature: '123456',
    }

    const sourceCertsStr = JSON.stringify(sourceCertsObj)
    let sourceCertsHex = hexlify(toUtf8Bytes(sourceCertsStr))
    sourceCertsHex = sourceCertsHex.substring(2)
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
      channel: 'ghost',
    }

    const freezeParams = Object.freeze(params)
    let raw = sortParams(freezeParams, fromAddress)
    raw = keccak256(hexlify(toUtf8Bytes(raw!)))

    const keyGenerator = KeyManager.createKeyGenerator()
    const privateKey = keyGenerator.receiveKey(0)
    const signature = signMessage({ message: raw, privateKey })

    const header = {
      Address: fromAddress,
      PublicKey: publicKey,
      Chain: 'KAS',
      Signature: signature,
    }

    const response = await axios.post<ChaingeOrderResponse>(API_SUBMIT_ORDER_URL, params, {
      headers: {
        'Content-Type': 'application/json',
        ...header,
      },
    })

    const chaingeOrderId = response.data.data.id

    const postChaingeOrderRequest: PostChaingeOrderRequest = {
      walletAddress: fromAddress,
      payTokenTicker: getChaingeTicker(fromToken),
      payAmount: fromAmount,
      receiveTokenTicker: getChaingeTicker(toToken),
      receiveAmount: receiveAmountHr,
      receiveAmountUsd: quote.outAmountUsd,
      slippage,
      serviceFeeUsd,
      transactionId,
      chaingeOrderId,
      quote,
      orderTimestamp: Math.floor(Date.now() / 1000),
    }

    try {
      await this.reportChaingeOrder(postChaingeOrderRequest)
    } catch (error) {
      console.warn('Could not send Chainge swap order data to GhostWallet database')
    }

    return response.data
  }

  async reportChaingeOrder(postRequest: PostChaingeOrderRequest) {
    const keyGenerator = KeyManager.createKeyGenerator()
    const privateKey = keyGenerator.receiveKey(0)

    const message = JSON.stringify(postRequest, Object.keys(postRequest).sort())
    const signature = signMessage({ message, privateKey })

    if (!this.addresses.publicKey) {
      throw new Error('public key not available')
    }
    const publicKey = this.addresses.publicKey.receivePubkeyAsString(0)

    const headers = {
      'Content-Type': 'application/json',
      Signature: `${signature}`,
      'Public-Key': publicKey,
    }

    return axios.post(API_POST_ORDER_URL, postRequest, { headers })
  }

  private async sendChaingeTransaction(fromAmount: string, fromToken: ChaingeToken, feeRate: number) {
    if (fromToken.contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      // KAS
      const [transactions] = await this.transactions.create(
        [[chaingeMinterAddresses.KAS, fromAmount]],
        feeRate,
        '0',
      )
      const submittedTransactions = await this.transactions.submitKaspaTransaction(transactions)
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
      const [commitId, revealId] = await this.krc20Transactions.submitKRC20Transaction(info, feeRate)
      return revealId
    }
  }

  async estimateChaingeTransactionFees({ fromAmount, fromToken, feeRate }: ChaingeFeeEstimateRequest) {
    if (fromToken.contractAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      // KAS
      return this.transactions.estimateKaspaTransactionFee(
        [[chaingeMinterAddresses.KAS, fromAmount]],
        feeRate,
        '0',
      )
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
      return this.krc20Transactions.estimateKRC20TransactionFee(info, feeRate)
    }
  }
}
