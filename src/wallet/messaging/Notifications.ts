import type Wallet from '../kaspa/Wallet'
import type Node from '../kaspa/Node'
import type AccountManager from '../kaspa/account/AccountManager'
import type { EventMessage, EventMappings } from '@/wallet/messaging/RequestMappings'
import Provider from '@/wallet/messaging/provider/Provider'

export default class Notifications {
  private callback: ((event: EventMessage) => void) | undefined

  constructor({
    wallet,
    node,
    account,
    provider,
  }: {
    wallet: Wallet
    node: Node
    account: AccountManager
    provider: Provider
  }) {
    wallet.on('status', (status) => this.handleEvent('wallet:status', status))
    node.on('connection', (status) => this.handleEvent('node:connection', status))
    node.on('network', (networkId) => this.handleEvent('node:network', networkId))
    account.on('balance', (balance) => this.handleEvent('account:balance', balance))
    account['addresses'].on('addresses', (addresses) => this.handleEvent('account:addresses', addresses))
    provider.on('connection', (url) => this.handleEvent('provider:connection', url))
  }

  registerCallback(callback: (event: EventMessage) => void) {
    this.callback = callback
  }

  private handleEvent<E extends keyof EventMappings>(event: E, data: EventMappings[E]) {
    if (!this.callback) return

    this.callback({ event, data })
  }
}
