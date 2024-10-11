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
    console.log('[Router] Initializing router with mappings...')

    this.mappings = {
      'wallet:status': () => wallet.status,
      'wallet:create': (password) => wallet.create(password),
      'wallet:import': (mnemonic, password) => wallet.import(mnemonic, password),
      'wallet:unlock': (password) => wallet.unlock(0, password),
      'wallet:export': (password) => wallet.export(password),
      'wallet:lock': () => wallet.lock(),
      'wallet:reset': () => wallet.reset(),
      'wallet:validate': (address) => {
        console.log('[Router] Registering wallet:validate method with address:', address)
        return wallet.validate(address)
      },
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

    console.log('[Router] Mappings initialized:', this.mappings)
  }

  async route<M extends keyof RequestMappings>(request: Request<M>) {
    console.log('[Router] Received request:', request)
    console.log(`[Router] Routing request - Method: "${request.method}", Params:`, request.params)
    console.log('[Router] Current mappings:', Object.keys(this.mappings))

    let response: Response<M> = {
      id: request.id,
      result: undefined,
    }

    const requestedMethod = this.mappings[request.method]
    console.log('[Router] Available methods on initialization:', Object.keys(this.mappings))
    console.log(`[Router] Looking for method "${request.method}" in mappings.`)
    console.log(`[Router] Method found:`, requestedMethod)

    if (!requestedMethod) {
      console.error(`[Router] Method "${request.method}" not found in mappings.`)
      response.error = `Method "${request.method}" not found.`
      return response
    }

    try {
      console.log(`[Router] Executing method "${request.method}" with params:`, request.params)
      response.result = await requestedMethod(...request.params)
      console.log(
        `[Router] Method "${request.method}" executed successfully. Result:`,
        response.result,
      )
    } catch (err) {
      console.error(`[Router] Error executing method "${request.method}":`, err)
      if (err instanceof Error) {
        response.error = err.message
      } else if (typeof err === 'string') {
        response.error = err
      } else throw err
    }

    console.log('[Router] Returning response:', response)
    return response
  }
}
