import { EventEmitter } from 'events'
import { UtxoContext, UtxoProcessor, PublicKeyGenerator, UtxoEntryReference } from '@/wasm'
import type Node from '../node'
import Addresses from './addresses'
import SessionStorage from '@/storage/SessionStorage'
import Transactions from './transactions'

export interface UTXO {
  amount: number
  transaction: string
  mature: boolean
}

console.log('Initializing Account, which uses Node')

export default class Account extends EventEmitter {
  processor: UtxoProcessor
  addresses: Addresses
  context: UtxoContext
  transactions: Transactions

  constructor(node: Node) {
    super()
    console.log('[Account] Setting up this.processor', node.rpcClient, node.networkId)
    this.processor = new UtxoProcessor({
      rpc: node.rpcClient,
      networkId: node.networkId,
    })
    this.context = new UtxoContext({ processor: this.processor })
    this.addresses = new Addresses(this.context, node.networkId)
    this.transactions = new Transactions(node.rpcClient, this.context, this.addresses)
    this.transactions.setAccount(this)

    node.on('network', async (networkId: string) => {
      await this.addresses.changeNetwork(networkId)

      if (this.processor.isActive) {
        await this.processor.stop()
        this.processor.setNetworkId(networkId)
        await this.processor.start()
      } else {
        this.processor.setNetworkId(networkId)
      }
    })

    this.registerProcessor()
    this.listenSession()
  }

  get balance() {
    return Number(this.context.balance?.mature ?? 0) / 1e8
  }

  get UTXOs() {
    const mapUTXO = (utxo: UtxoEntryReference, mature: boolean) => ({
      amount: Number(utxo.amount) / 1e8,
      transaction: utxo.outpoint.transactionId,
      mature,
    })

    const pendingUTXOs = this.context.getPending().map((utxo) => mapUTXO(utxo, false))
    const matureUTXOs = this.context
      .getMatureRange(0, this.context.matureLength)
      .map((utxo) => mapUTXO(utxo, true))

    return [...pendingUTXOs, ...matureUTXOs]
  }

  async scan(steps = 50, count = 10) {
    const scanAddresses = async (isReceive: boolean, startIndex: number) => {
      let foundIndex = 0

      for (let index = 0; index < steps; index++) {
        const addresses = await this.addresses.derive(isReceive, startIndex, startIndex + count)
        startIndex += count

        const { entries } = await this.processor.rpc.getUtxosByAddresses(addresses)
        const entryIndex = addresses.findIndex((address) =>
          entries.some((entry) => entry.address?.toString() === address),
        )

        if (entryIndex !== -1) {
          foundIndex = startIndex - count + entryIndex
        }
      }

      await this.addresses.increment(isReceive ? foundIndex : 0, isReceive ? 0 : foundIndex)
    }

    await scanAddresses(true, this.addresses.receiveAddresses.length)
    await scanAddresses(false, this.addresses.changeAddresses.length)
  }

  private registerProcessor() {
    this.processor.addEventListener('utxo-proc-start', async () => {
      await this.context.clear()
      await this.context.trackAddresses(this.addresses.allAddresses)
    })

    this.processor.addEventListener('pending', async (event) => {
      console.log('[Account] TODO - Use this data to fix data?.utxoEntires ??:', event.data)

      // Adjust based on the actual structure of event.data TODO
      // @ts-ignore
      const utxos = event.data?.utxoEntries ?? []

      if (
        utxos.some(
          (utxo: UtxoEntryReference) =>
            utxo.address?.toString() ===
            this.addresses.receiveAddresses[this.addresses.receiveAddresses.length - 1],
        )
      ) {
        await this.addresses.increment(1, 0)
      }
    })

    this.processor.addEventListener('balance', () => {
      this.emit('balance', this.balance)
    })
  }

  private listenSession() {
    SessionStorage.subscribeChanges(async (key, newValue) => {
      console.log('[Account] listenSession() subscribe changes')
      if (key !== 'session') return

      if (newValue) {
        console.log('[Account] newValue')
        await this.addresses.import(
          PublicKeyGenerator.fromXPub(newValue.publicKey),
          newValue.activeAccount,
        )
        await this.transactions.import(newValue.encryptedKey, newValue.activeAccount)
        await this.processor.start()
      } else {
        console.log('[Account] Resetting everything')
        this.addresses.reset()
        this.transactions.reset()
        await this.processor.stop()
        await this.context.clear()
      }
    })
  }
}
