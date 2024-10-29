import { PublicKeyGenerator, UtxoContext } from '@/wasm'
import { EventEmitter } from 'events'
import SessionStorage from '@/storage/SessionStorage'
import LocalStorage from '@/storage/LocalStorage'

export default class Addresses extends EventEmitter {
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
    // const session = await SessionStorage.get('session', undefined)

    // if (!session?.publicKey) {
    //   throw Error('[Addresses] No publicKey in SessionStorage')
    // }
    // this.publicKey = PublicKeyGenerator.fromXPub(session.publicKey)
    if (!this.publicKey) {
      throw Error('[Addresses] No publicKey')
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
