import browser from 'webextension-polyfill'
import type { Request, Event, EventMappings } from '@/provider/protocol'
import Windows from '@/wallet/messaging/provider/Windows'
import Account from '@/wallet/Account'
import { EventEmitter } from 'events'

export default class Provider extends EventEmitter {
  private windows: Windows
  private account: Account
  private port: browser.Runtime.Port | undefined
  private granted: boolean = false

  constructor(account: Account) {
    super()

    this.windows = new Windows()
    this.account = account

    this.registerEvents()
  }

  get connectedURL() {
    return this.granted ? this.port?.sender?.url! : ''
  }

  async askAccess(port: browser.Runtime.Port) {
    if (this.port) return port.disconnect()

    this.port = port

    const id = await this.windows.open(
      'connect',
      {
        url: port.sender!.url!,
      },
      () => {
        if (this.granted) return

        this.port!.disconnect()
        delete this.port
      },
    )

    this.port.onDisconnect.addListener(() => {
      if (this.windows.check(id)) browser.windows.remove(id)
      this.disconnect()
    })
  }

  connect(url: string) {
    if (!this.port) throw Error('No port found')

    this.granted = true

    this.port.onMessage.addListener((request) => this.handleMessage(request))
    this.submitEvent(0, 'account', {
      balance: this.account.balance,
      addresses: this.account.addresses.receiveAddresses,
      networkId: this.account.addresses.networkId,
    })

    this.emit('connection', url)
  }

  disconnect() {
    if (!this.port) throw Error('Not connected')

    this.granted = false
    this.port.disconnect()
    delete this.port

    this.emit('connection', '')
  }

  private submitEvent<E extends keyof EventMappings>(
    id: number,
    event: E,
    data: EventMappings[E] | false,
    error?: string,
  ) {
    if (!this.port || !this.granted) return

    const encodedEvent: Event<E> = { id, event, data, error }
    this.port.postMessage(encodedEvent)
  }

  private async handleMessage(request: Request) {
    if (request.method === 'account') {
      this.submitEvent(request.id, 'account', {
        balance: this.account.balance,
        addresses: this.account.addresses.receiveAddresses,
        networkId: this.account.addresses.networkId,
      })
    } else if (request.method === 'transact') {
      let transaction: string

      const appendTransaction = (summary: string) => {
        transaction = summary
      }

      await this.windows.open(
        'transact',
        {
          outputs: JSON.stringify(request.params[0], null, 0),
          fee: request.params[1],
          inputs: JSON.stringify(request.params[2], null, 0),
        },
        () => {
          if (transaction) {
            this.submitEvent(request.id, 'transact', transaction)
          } else {
            this.submitEvent(request.id, 'transact', false, 'User rejected the request.')
          }

          this.account.transactions.off('transaction', appendTransaction)
        },
      )

      this.account.transactions.once('transaction', appendTransaction)
    }
  }

  private registerEvents() {
    this.account.on('balance', () => {
      this.submitEvent(0, 'account', {
        balance: this.account.balance,
        addresses: this.account.addresses.receiveAddresses,
        networkId: this.account.addresses.networkId,
      })
    })
  }
}
