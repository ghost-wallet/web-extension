import type Wallet from '../../kaspa/wallet'
import type Node from '../../kaspa/node'
import type Account from '../../kaspa/account'
import type { Request, Response, RequestMappings, ResponseMappings } from '../protocol'
import type Provider from './provider'

type MappingsRecord<M extends keyof RequestMappings = keyof RequestMappings> = {
  [K in M]: (...params: RequestMappings[K]) => Promise<ResponseMappings[K]> | ResponseMappings[K]
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
      'wallet:create': (password) => wallet.create(password),
      'wallet:import': (mnemonic, password) => wallet.import(mnemonic, password),
      'wallet:unlock': (password) => wallet.unlock(0, password),
      'wallet:export': (password) => wallet.export(password),
      'wallet:lock': () => wallet.lock(),
      'wallet:reset': () => wallet.reset(),
      'wallet:validate': (address) => wallet.validate(address),
      'node:connection': () => node.connected,
      'node:connect': (address) => node.reconnect(address),
      'node:priorityBuckets': () => node.getPriorityBuckets(),
      'node:submit': (transactions) => node.submit(transactions),
      'account:addresses': () => [
        account.addresses.receiveAddresses,
        account.addresses.changeAddresses,
      ],
      'account:balance': () => account.balance,
      'account:utxos': () => account.UTXOs,
      'account:create': (outputs, feeRate, fee, inputs) =>
        account.transactions.create(outputs, feeRate, fee, inputs),
      'account:sign': (transactions, password, customSignatures) =>
        account.transactions.sign(transactions, password, customSignatures),
      'account:submitContextful': (transactions) =>
        account.transactions.submitContextful(transactions),
      'account:scan': () => account.scan(),
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
      console.error(`[Router] Method "${request.method}" not found in mappings.`)
      response.error = `Method "${request.method}" not found.`
      return response
    }

    try {
      response.result = await requestedMethod(...request.params)
    } catch (err) {
      console.error(`[Router] Error executing method "${request.method}":`, err)
      if (err instanceof Error) {
        response.error = err.message
      } else if (typeof err === 'string') {
        response.error = err
      } else throw err
    }

    return response
  }
}
