import { PublicKeyGenerator, UtxoContext } from '@/wasm'
import { EventEmitter } from 'events'
import SessionStorage from '@/storage/SessionStorage'
import LocalStorage from '@/storage/LocalStorage'

export default class Addresses extends EventEmitter {
  context: UtxoContext
  publicKey: PublicKeyGenerator | undefined
  accountId: number | undefined
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

  async import(publicKey: PublicKeyGenerator, accountId: number) {
    this.publicKey = publicKey
    this.accountId = accountId

    const accounts = (await LocalStorage.get('wallet', undefined))!.accounts
    const account = accounts[accountId]
    await this.increment(account.receiveCount, false)
  }

  async derive(start: number, end: number) {
    const session = await SessionStorage.get('session', undefined)

    if (!session?.publicKey) {
      throw Error('[Addresses] No publicKey in SessionStorage')
    }
    this.publicKey = PublicKeyGenerator.fromXPub(session.publicKey)
    return this.publicKey.receiveAddressAsStrings(this.networkId, start, end)
  }

  async increment(receiveCount: number, commit = true) {
    const addresses = await Promise.all([
      this.derive(this.receiveAddresses.length, this.receiveAddresses.length + receiveCount),
    ])

    this.receiveAddresses.push(...addresses[0])

    if (this.context.isActive) await this.context.trackAddresses(addresses.flat())

    this.emit('addresses', addresses)
  }

  findIndexes(address: string): [boolean, number] {
    const receiveIndex = this.receiveAddresses.indexOf(address)
    return [true, receiveIndex]
  }

  async changeNetwork(networkId: string) {
    this.networkId = networkId
    this.receiveAddresses = await this.derive(0, this.receiveAddresses.length)
  }

  reset() {
    delete this.publicKey
    delete this.accountId

    this.receiveAddresses = []
  }
}
