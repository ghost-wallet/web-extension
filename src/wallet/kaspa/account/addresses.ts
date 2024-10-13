import { PublicKeyGenerator, UtxoContext } from '@/wasm'
import LocalStorage from '@/storage/LocalStorage'
import { EventEmitter } from 'events'

export default class Addresses extends EventEmitter {
  context: UtxoContext
  publicKey: PublicKeyGenerator | undefined
  accountId: number | undefined
  networkId: string
  receiveAddresses: string[] = []
  changeAddresses: string[] = []

  constructor(context: UtxoContext, networkId: string) {
    super()
    this.context = context
    this.networkId = networkId
    console.log('[Addresses] Initialized with networkId:', networkId)
  }

  get allAddresses() {
    return [...this.receiveAddresses, ...this.changeAddresses]
  }

  async import(publicKey: PublicKeyGenerator, accountId: number) {
    console.log('[Addresses] Importing publicKey and accountId:', publicKey, accountId)
    this.publicKey = publicKey
    this.accountId = accountId

    const accounts = (await LocalStorage.get('wallet', undefined))!.accounts
    console.log('[Addresses] Accounts from LocalStorage', accounts)

    const account = accounts[accountId]
    await this.increment(account.receiveCount, account.changeCount, false)
  }

  async derive(isReceive: boolean, start: number, end: number) {
    if (!this.publicKey) {
      throw Error('No active account')
    }

    console.log(
      `[Addresses] Deriving addresses: ${isReceive ? 'receive' : 'change'}, start: ${start}, end: ${end}`,
    )

    if (isReceive) {
      return this.publicKey.receiveAddressAsStrings(this.networkId, start, end)
    } else {
      return this.publicKey.changeAddressAsStrings(this.networkId, start, end)
    }
  }

  async increment(receiveCount: number, changeCount: number, commit = true) {
    const addresses = await Promise.all([
      this.derive(true, this.receiveAddresses.length, this.receiveAddresses.length + receiveCount),
      this.derive(false, this.changeAddresses.length, this.changeAddresses.length + changeCount),
    ])

    this.receiveAddresses.push(...addresses[0])
    this.changeAddresses.push(...addresses[1])

    if (this.context.isActive) await this.context.trackAddresses(addresses.flat())
    if (commit) await this.commit()

    this.emit('addresses', addresses)
  }

  findIndexes(address: string): [boolean, number] {
    console.log('[Addresses] Finding index for address:', address)

    const receiveIndex = this.receiveAddresses.indexOf(address)
    const changeIndex = this.changeAddresses.indexOf(address)

    if (receiveIndex !== -1) {
      return [true, receiveIndex]
    } else if (changeIndex !== -1) {
      return [false, changeIndex]
    } else {
      throw Error('Failed to find index of address over HD wallet')
    }
  }

  async changeNetwork(networkId: string) {
    console.log('[Addresses] Changing network to:', networkId)
    this.networkId = networkId
    this.receiveAddresses = await this.derive(true, 0, this.receiveAddresses.length)
    this.changeAddresses = await this.derive(false, 0, this.changeAddresses.length)
  }

  reset() {
    delete this.publicKey
    delete this.accountId

    this.receiveAddresses = []
    this.changeAddresses = []
  }

  private async commit() {
    const wallet = (await LocalStorage.get('wallet', undefined))!
    console.log('[Addresses] Commit wallet', wallet)
    const account = wallet.accounts[this.accountId!]

    account.receiveCount = this.receiveAddresses.length
    account.changeCount = this.changeAddresses.length

    await LocalStorage.set('wallet', wallet)
  }
}
