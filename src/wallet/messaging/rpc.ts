import browser from 'webextension-polyfill'
import Router from './wallet/router'
import Notifier from './wallet/notifications'
import type { Request } from './messageMappings'
import type Wallet from '../kaspa/wallet'
import type Node from '../kaspa/node'
import type Account from '../kaspa/account/account'
import Provider from './wallet/provider'

export default class RPC {
  provider: Provider
  notifier: Notifier
  router: Router

  private ports: Set<browser.Runtime.Port> = new Set()

  constructor({ wallet, node, account }: { wallet: Wallet; node: Node; account: Account }) {
    console.log('[RPC] Initializing RPC class...')

    this.provider = new Provider(account)
    this.notifier = new Notifier({
      wallet,
      node,
      account,
      provider: this.provider,
    })
    this.router = new Router({ wallet, node, account, provider: this.provider })

    this.listen()
  }

  private listen() {
    console.log('[RPC] Setting up browser runtime connection listener.')

    browser.runtime.onConnect.addListener((port) => {
      console.log(`[RPC] Port connected with name: ${port.name} and ID: ${port.sender?.id}`)

      if (port.sender?.id !== browser.runtime.id) {
        console.warn('[RPC] Port sender ID does not match. Disconnecting port...')
        return port.disconnect()
      }

      if (port.name === '@ghost/client') {
        this.permitPort(port)
      } else if (port.name === '@ghost/provider') {
        this.provider.askAccess(port)
      } else {
        console.warn(`[RPC] Unrecognized port name: ${port.name}. Disconnecting port...`)
        port.disconnect()
      }
    })

    this.notifier.registerCallback((event) => {
      console.log('[RPC] Notifier callback received an event:', event)

      for (const port of this.ports) {
        console.log('[RPC] Posting event to port:', port)
        port.postMessage(event)
      }
    })
  }

  private permitPort(port: browser.Runtime.Port) {
    this.ports.add(port)

    const onMessageListener = async (request: Request) => {
      console.log('[RPC] Message received on port:', request)

      try {
        const response = await this.router.route(request)

        port.postMessage(response)
      } catch (error) {
        console.error('[RPC] Error processing request through router:', error)
        port.postMessage({
          id: request.id,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    port.onMessage.addListener(onMessageListener)

    port.onDisconnect.addListener(() => {
      port.onMessage.removeListener(onMessageListener)

      this.ports.delete(port)
    })
  }
}
