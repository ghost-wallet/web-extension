import { RpcClient, UtxoContext } from '@/wasm/kaspa'
import Addresses from '../kaspa/account/addresses'
import Transactions from '../kaspa/account/transactions'
import { defineProxyService, flattenPromise } from '@webext-core/proxy-service';
import {AggregateQuoteResponse, Token} from '@chainge/api-tool-sdk'

import { MaxUint256, ethers, formatUnits, hexlify, parseUnits, toUtf8Bytes } from 'ethers'
import BigNumber from 'bignumber.js';


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


  constructor(private context: UtxoContext, private addresses: Addresses, private transactions: Transactions) {
    //super()
  }

  async doChaingeOrder(fromAmount: string, fromToken: ChaingeToken, toToken: ChaingeToken, quote: Pick<AggregateQuoteResponse, 'chain' | 'chainDecimal' | 'outAmount' | 'serviceFee' | 'gasFee' | 'slippage'> ) {
    const amount = parseUnits(fromAmount, fromToken.decimals).toString()

    const { chain, chainDecimal, outAmount, serviceFee, gasFee, slippage } = quote
    const receiveAmount = BigInt(outAmount) - BigInt(serviceFee) - BigInt(gasFee)
    if(receiveAmount <= BigInt(0)) {
      throw 'The current quote amount cannot cover the fees. Please enter a larger amount.'
    }

    // Calculate the value the user should receive. 
    const receiveAmountHr = formatUnits(receiveAmount, chainDecimal)
    const receiveAmountForExtra = parseUnits(receiveAmountHr, chainDecimal).toString()

    // Computed minimum, After calculating the minimum value, we need to convert it to the decimals of the target chain.
    const miniAmount = BigNumber(receiveAmountHr).multipliedBy(BigNumber((1 - (slippage * 0.01)))).toString()
    const miniAmountForExtra = parseUnits(miniAmount, chainDecimal).toString()



  }

  



  


}


export const [registerChaingeService, getChaingeService] = defineProxyService(
  'ChaingeService',
  (context: UtxoContext, addresses: Addresses, transactions: Transactions) => new Chainge(context, addresses, transactions),
);