import { PublicKeyGenerator, UtxoContext } from '@/wasm'
import { EventEmitter } from 'events'
import LocalStorage from '@/storage/LocalStorage'

export default class AccountAddresses extends EventEmitter {
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

  async import(publicKey: PublicKeyGenerator) {
    this.publicKey = publicKey
    this.accountId = 1
    const account = (await LocalStorage.get('walletV2', undefined))!.accounts[this.accountId]
    console.log('imported account:', account)

    await this.increment(account.receiveCount, account.changeCount)

    // await this.registerReceiveAddress()
  }

  async increment(receiveCount: number, changeCount: number) {
    const addresses = await Promise.all([
      this.derive(this.receiveAddresses.length, this.receiveAddresses.length + receiveCount),
    ])

    console.log('derived addresses:', addresses)

    this.receiveAddresses.push(...addresses[0])

    console.log('this.receiveAddresses:', this.receiveAddresses)

    if (this.context.isActive) await this.context.trackAddresses(addresses.flat())

    this.emit('addresses', addresses)
  }

  async derive(start: number, end: number) {
    if (!this.publicKey) throw Error('No active account')
    console.log(
      'this.publicKey.receiveAddressAsStrings(this.networkId, start+1, end+1)',
      this.publicKey.receiveAddressAsStrings(this.networkId, start + 1, end + 1),
    )
    console.log(
      'this.publicKey.receiveAddressAsStrings(this.networkId, start, end)',
      this.publicKey.receiveAddressAsStrings(this.networkId, start, end),
    )
    console.log('public key, start, end', this.publicKey, start, end)

    return this.publicKey.receiveAddressAsStrings(this.networkId, start, end)
  }

  // async registerReceiveAddress() {
  //   this.receiveAddresses = [await this.derive()]
  //   if (this.context.isActive) {
  //     await this.context.trackAddresses(this.receiveAddresses)
  //   }
  //   this.emit('addresses', this.receiveAddresses)
  // }

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

    this.receiveAddresses = []
  }
}
