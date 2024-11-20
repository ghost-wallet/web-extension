import browser from 'webextension-polyfill'
import Router from './messaging/Router'
import Notifier from './messaging/Notifications'
import type { Request } from '@/wallet/messaging/RequestMappings'
import type Wallet from './Wallet'
import type Node from './Node'
import type Account from '@/wallet/Account'
import Provider from '@/wallet/messaging/provider/Provider'

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
      try {
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
      } catch (error) {
        console.error('[RPC] Error in onConnect listener:', error)
      }
    })

    this.notifier.registerCallback((event) => {
      for (const port of this.ports) {
        try {
          port.postMessage(event)
        } catch (error) {
          console.warn('[RPC] Failed to send message to port:', error)
        }
      }
    })
  }

  private permitPort(port: browser.Runtime.Port) {
    this.ports.add(port)

    const onMessageListener = async (request: Request | 'ping') => {
      if(request === 'ping') {
        port.postMessage('pong')
        return
      }
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
      console.log(`[RPC] Port disconnected: ${port.name}`)
      port.onMessage.removeListener(onMessageListener)
      this.ports.delete(port)
    })
  }
}
