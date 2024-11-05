import { PublicKeyGenerator, UtxoContext } from '@/wasm'
import { EventEmitter } from 'events'

export default class AccountAddresses extends EventEmitter {
  context: UtxoContext
  publicKey: PublicKeyGenerator | undefined
  networkId: string
  receiveAddresses: string[] = []

  constructor(context: UtxoContext, networkId: string) {
    super()
    this.context = context
    this.networkId = networkId
  }

  get allAddresses() {
    return this.receiveAddresses
  }

  async import(publicKey: PublicKeyGenerator) {
    this.publicKey = publicKey

    await this.registerReceiveAddress()
  }

  async derive() {
    if (!this.publicKey) {
      throw Error('[AccountAddresses] No publicKey')
    }
    return this.publicKey.receiveAddressAsString(this.networkId, 0)
  }

  async registerReceiveAddress() {
    this.receiveAddresses = [await this.derive()]
    if (this.context.isActive) {
      await this.context.trackAddresses(this.receiveAddresses)
    }
    this.emit('addresses', this.receiveAddresses)
  }

  findIndexes(address: string): [boolean, number] {
    const receiveIndex = this.receiveAddresses.indexOf(address)
    return [true, receiveIndex]
  }

  async changeNetwork(networkId: string) {
    this.networkId = networkId
    this.receiveAddresses = [await this.derive()]
  }

  reset() {
    delete this.publicKey

    this.receiveAddresses = []
  }
}
