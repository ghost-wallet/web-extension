import browser from 'webextension-polyfill'
import Router from './Router'
import Notifier from './Notifications'
import type { Request } from '@/wallet/messaging/RequestMappings'
import type Wallet from '../kaspa/Wallet'
import type Node from '../kaspa/Node'
import type AccountManager from '../kaspa/account/AccountManager'
import Provider from '@/wallet/messaging/provider/Provider'

export default class RPC {
  provider: Provider
  notifier: Notifier
  router: Router

  private ports: Set<browser.Runtime.Port> = new Set()

  constructor({ wallet, node, account }: { wallet: Wallet; node: Node; account: AccountManager }) {
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
      for (const port of this.ports) {
        port.postMessage(event)
      }
    })
  }

  private permitPort(port: browser.Runtime.Port) {
    this.ports.add(port)

    const onMessageListener = async (request: Request) => {
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