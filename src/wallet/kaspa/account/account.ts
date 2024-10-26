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
  node: Node

  constructor(node: Node) {
    super()
    this.node = node
    console.log('[Account] Setting up this.processor', node.rpcClient, node.networkId)
    this.processor = new UtxoProcessor({
      rpc: node.rpcClient,
      networkId: node.networkId,
    })
    this.context = new UtxoContext({ processor: this.processor })
    this.addresses = new Addresses(this.context, node.networkId)
    this.transactions = new Transactions(node.rpcClient, this.context, this.processor, this.addresses)
    this.transactions.setAccount(this)
    console.log('[Account] Initial context data:', this.context)
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

  async scan(quick = false): Promise<[number, number]> {
    if (!this.node.connected) {
      await this.node.waitUntilConnected()
    }
    console.log('[Account] Scan started')
    console.log('[Account] Scan: current receive addresses', this.addresses.receiveAddresses)
    console.log('[Account] Scan: current change addresses', this.addresses.changeAddresses)

    const receive = await this.scanAddresses(
      true,
      this.addresses.receiveAddresses.length,
      quick ? 8 : 128,
      quick ? 8 : 128,
    )
    const change = await this.scanAddresses(
      false,
      this.addresses.changeAddresses.length,
      quick ? 128 : 1024,
      128,
    )

    console.log('[Account] Scan complete')
    console.log('[Account] Scan: current receive addresses', this.addresses.receiveAddresses)
    console.log('[Account] Scan: current change addresses', this.addresses.changeAddresses)

    return [receive, change]
  }

  private async scanAddresses(isReceive: boolean, start: number, maxEmpty: number, windowSize = 8) {
    console.log(
      `[Account] Starting Scan for ${isReceive ? 'recieve' : 'change'} addresses. Starting at ${start}.`,
    )
    let index = start
    let foundIndex = start
    do {
      const addresses = await this.addresses.derive(isReceive, index, index + windowSize)

      const { entries } = await this.processor.rpc.getUtxosByAddresses(addresses)

      const entryIndex = addresses.findLastIndex((address) =>
        entries.some((entry) => entry.address?.toString() === address),
      )
      if (entryIndex !== -1) {
        foundIndex = index + entryIndex
      }
      index += windowSize
    } while (index - foundIndex < maxEmpty)
    const numToIncrement = foundIndex - start
    if (numToIncrement > 0) {
      await this.addresses.increment(isReceive ? numToIncrement : 0, isReceive ? 0 : numToIncrement)
    }
    console.log(`[Account] Scan done. Found ${numToIncrement} addresses. Address counter now ${foundIndex}.`)
    return numToIncrement
  }

  private registerProcessor() {
    console.log('[Account] Context data when processor is registered:', this.context)

    this.processor.addEventListener('utxo-proc-start', async () => {
      await this.context.clear()
      await this.context.trackAddresses(this.addresses.allAddresses)
    })

    // this.processor.addEventListener('pending', async (event) => {
    //   //console.log('[Account] TODO - Use this data to fix data?.utxoEntires ??:', event.data)

    //   console.log('[Account] UTXO processor pending event:', event.data)

    //   // Adjust based on the actual structure of event.data TODO
    //   // @ts-ignore
    //   const utxos = event.data?.utxoEntries ?? []

    //   if (
    //     utxos.some(
    //       (utxo: UtxoEntryReference) =>
    //         utxo.address?.toString() ===
    //         this.addresses.receiveAddresses[this.addresses.receiveAddresses.length - 1],
    //     )
    //   ) {
    //     console.log('[Account] Found matching address in UTXO, incrementing recieve address?')
    //     await this.addresses.increment(1, 0)
    //   }
    // })

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
        await this.addresses.import(PublicKeyGenerator.fromXPub(newValue.publicKey), newValue.activeAccount)
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
