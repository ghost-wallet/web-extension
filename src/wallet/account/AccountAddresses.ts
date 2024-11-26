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
    console.log('[AccountAddresses] get allAddresses()', this.receiveAddresses)
    return this.receiveAddresses
  }

  async import(publicKey: PublicKeyGenerator) {
    this.publicKey = publicKey

    await this.registerReceiveAddress()
  }

  async derive() {
    const total = 5
    if (!this.publicKey) {
      throw Error('[AccountAddresses] No publicKey')
    }
    const addresses: string[] = []

    for (let i = 0; i < total; i++) {
      const address = this.publicKey.receiveAddressAsString(this.networkId, i)
      console.log(`[AccountAddresses] derive ${i}`, address)
      addresses.push(address)
    }

    return addresses
  }

  async registerReceiveAddress() {
    this.receiveAddresses = await this.derive()

    if (this.context.isActive) {
      await this.context.trackAddresses(this.receiveAddresses)
    }

    this.emit('addresses', this.receiveAddresses)
  }

  findIndexes(address: string): [boolean, number] {
    const receiveIndex = this.receiveAddresses.indexOf(address)
    const found = receiveIndex !== -1 // Ensure the address exists
    return [found, receiveIndex]
  }

  async changeNetwork(networkId: string) {
    this.networkId = networkId

    this.receiveAddresses = await this.derive()
  }

  reset() {
    delete this.publicKey

    this.receiveAddresses = []
  }
}
