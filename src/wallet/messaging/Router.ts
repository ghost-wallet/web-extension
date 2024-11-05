import type Wallet from '../Wallet'
import type Node from '../Node'
import type Account from '@/wallet/Account'
import { RequestMappings, Request } from './RequestMappings'
import { ResponseMappings, Response } from './ResponseMappings'
import type Provider from '@/wallet/messaging/provider/Provider'

type MappingsRecord<M extends keyof RequestMappings = keyof RequestMappings> = {
  [K in M]: (...params: RequestMappings[K]) => Promise<ResponseMappings[M]> | ResponseMappings[K]
}

export default class Router {
  private mappings: MappingsRecord

  constructor({
    wallet,
    node,
    account,
    provider,
  }: {
    wallet: Wallet
    node: Node
    account: Account
    provider: Provider
  }) {
    this.mappings = {
      'wallet:status': () => wallet.status,
      'wallet:createMnemonic': () => wallet.createMnemonic(),
      'wallet:import': (mnemonic, password) => wallet.import(mnemonic, password),
      'wallet:unlock': (password) => wallet.unlock(0, password), // Returns Promise<string>
      'wallet:export': (password) => wallet.export(password),
      'wallet:lock': () => wallet.lock(),
      'wallet:reset': () => wallet.reset(),
      'wallet:validate': (address) => wallet.validate(address),
      'node:connection': () => node.connected,
      'node:connect': (address) => node.reconnect(address),
      'node:priorityBuckets': () => node.getPriorityBuckets(),
      'node:submit': (transactions) => node.submit(transactions),
      'account:addresses': () => account.addresses.receiveAddresses,
      'account:balance': () => account.balance,
      'account:utxos': () => account.UTXOs,
      'account:estimateKaspaTransactionFee': (outputs, feeRate, fee) =>
        account.transactions.estimateKaspaTransactionFee(outputs, feeRate, fee),
      'account:create': (outputs, feeRate, fee, inputs) =>
        account.transactions.create(outputs, feeRate, fee, inputs),
      'account:sign': (transactions) => account.transactions.sign(transactions),
      'account:submitContextful': (transactions) => account.transactions.submitContextful(transactions),
      'account:submitKaspaTransaction': (transactions) =>
        account.transactions.submitKaspaTransaction(transactions),
      'account:getKRC20Info': (recipient, token, amount) =>
        account.transactions.getKRC20Info(recipient, token, amount),
      'account:submitKRC20Transaction': (info, feeRate) =>
        account.transactions.submitKRC20Transaction(info, feeRate),
      'account:estimateKRC20TransactionFee': (info, feeRate) =>
        account.transactions.estimateKRC20TransactionFee(info, feeRate),
      'account:doKRC20Mint': (ticker, feeRate, timesToMint) =>
        account.transactions.doKRC20Mint(ticker, feeRate, timesToMint),
      'account:estimateKRC20MintFees': (ticker, feeRate, timesToMint) =>
        account.transactions.estimateKRC20MintFees(ticker, feeRate, timesToMint),
      'provider:connect': (url) => provider.connect(url),
      'provider:connection': () => provider.connectedURL,
      'provider:disconnect': () => provider.disconnect(),
    }
  }

  async route<M extends keyof RequestMappings>(request: Request<M>) {
    let response: Response<M> = {
      id: request.id,
      result: undefined,
    }

    const requestedMethod = this.mappings[request.method]

    if (!requestedMethod) {
      response.error = `Method "${request.method}" not found.`
      return response
    }

    try {
      const result = await requestedMethod(...request.params)
      response.result = result as ResponseMappings[M] // Type assertion here
    } catch (err) {
      if (err instanceof Error) {
        response.error = err.message
      } else if (typeof err === 'string') {
        response.error = err
      } else {
        throw err
      }
    }

    return response
  }
}
