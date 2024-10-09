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
    console.log('Initializing Addresses class with networkId:', networkId)

    this.context = context
    this.networkId = networkId
  }

  get allAddresses() {
    console.log('Fetching all addresses')
    return [...this.receiveAddresses, ...this.changeAddresses]
  }

  async import(publicKey: PublicKeyGenerator, accountId: number) {
    console.log('Importing public key and account ID:', accountId)
    this.publicKey = publicKey
    this.accountId = accountId

    const account = (await LocalStorage.get('wallet', undefined))!.accounts[
      accountId
    ]

    console.log('Localstorage.get wallet:', account)
    await this.increment(account.receiveCount, account.changeCount, false)
  }

  async derive(isReceive: boolean, start: number, end: number) {
    console.log(
      `Deriving addresses: isReceive=${isReceive}, start=${start}, end=${end}`,
    )
    if (!this.publicKey) {
      console.error('No active account found while deriving addresses')
      throw Error('No active account')
    }

    if (isReceive) {
      console.log('Deriving receive addresses...')
      return this.publicKey.receiveAddressAsStrings(this.networkId, start, end)
    } else {
      console.log('Deriving change addresses...')
      return this.publicKey.changeAddressAsStrings(this.networkId, start, end)
    }
  }

  async increment(receiveCount: number, changeCount: number, commit = true) {
    console.log(
      `Incrementing addresses: receiveCount=${receiveCount}, changeCount=${changeCount}, commit=${commit}`,
    )
    try {
      const addresses = await Promise.all([
        this.derive(
          true,
          this.receiveAddresses.length,
          this.receiveAddresses.length + receiveCount,
        ),
        this.derive(
          false,
          this.changeAddresses.length,
          this.changeAddresses.length + changeCount,
        ),
      ])

      console.log('New addresses derived:', addresses)

      this.receiveAddresses.push(...addresses[0])
      this.changeAddresses.push(...addresses[1])

      if (this.context.isActive) {
        console.log('Context is active, tracking addresses...')
        await this.context.trackAddresses(addresses.flat())
      }
      if (commit) {
        console.log('Committing changes to storage...')
        await this.commit()
      }

      this.emit('addresses', addresses)
      console.log('Addresses incremented successfully.')
    } catch (error) {
      console.error('Error incrementing addresses:', error)
      throw error
    }
  }

  findIndexes(address: string): [boolean, number] {
    console.log('Finding index for address:', address)
    const receiveIndex = this.receiveAddresses.indexOf(address)
    const changeIndex = this.changeAddresses.indexOf(address)

    if (receiveIndex !== -1) {
      console.log('Address found in receive addresses at index:', receiveIndex)
      return [true, receiveIndex]
    } else if (changeIndex !== -1) {
      console.log('Address found in change addresses at index:', changeIndex)
      return [false, changeIndex]
    } else {
      console.error('Failed to find index of address:', address)
      throw Error('Failed to find index of address over HD wallet')
    }
  }

  async changeNetwork(networkId: string) {
    console.log('Changing network to:', networkId)
    this.networkId = networkId
    this.receiveAddresses = await this.derive(
      true,
      0,
      this.receiveAddresses.length,
    )
    this.changeAddresses = await this.derive(
      false,
      0,
      this.changeAddresses.length,
    )
    console.log('Network changed and addresses updated.')
  }

  reset() {
    console.warn('Resetting addresses and clearing public key and account ID.')
    delete this.publicKey
    delete this.accountId

    this.receiveAddresses = []
    this.changeAddresses = []
    console.log('Addresses reset successfully.')
  }

  private async commit() {
    console.log('Committing addresses to local storage...')
    const wallet = (await LocalStorage.get('wallet', undefined))!
    const account = wallet.accounts[this.accountId!]

    account.receiveCount = this.receiveAddresses.length
    account.changeCount = this.changeAddresses.length

    await LocalStorage.set('wallet', wallet)
    console.log('Commit successful.')
  }
}
