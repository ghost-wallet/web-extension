import { EventEmitter } from 'events'
import { UtxoContext, UtxoProcessor, PublicKeyGenerator, UtxoEntryReference } from '@/wasm'
import type Node from '../node'
import Addresses from './addresses'
import SessionStorage from '@/storage/SessionStorage'
import Transactions from './transactions'

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

    node.on('network', async (networkId: string) => {
      console.log('[Account] network event', networkId)
      //await this.addresses.changeNetwork(networkId)

      if (this.processor.isActive) {
        await this.processor.stop()
        this.processor.setNetworkId(networkId)
        await this.processor.start()
      } else {
        this.processor.setNetworkId(networkId)
      }

      await this.addresses.changeNetwork(networkId)
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

  async scan(): Promise<number> {
    if (!this.node.connected) {
      await this.node.waitUntilConnected()
    }
    console.log('[Account] Starting scan for addresses:', this.addresses.allAddresses)

    const foundUtxos = await this.scanSingleAddress()
    console.log('[Account] Scan complete and found utxos:', foundUtxos)
    return foundUtxos
  }

  private async scanSingleAddress(): Promise<number> {
    const address = this.addresses.receiveAddresses[0]
    const { entries } = await this.processor.rpc.getUtxosByAddresses([address])

    const numUtxosFound = entries.length
    console.log(`[Account] Scan done. Found ${numUtxosFound} UTXOs for the receive address.`)
    return numUtxosFound
  }

  private registerProcessor() {
    console.log('[Account] Context data when processor is registered:', this.context)

    this.processor.addEventListener('utxo-proc-start', async () => {
      console.log('[Account] utxo-proc-start event')
      await this.context.clear()
      await this.context.trackAddresses(this.addresses.allAddresses)
    })
    this.processor.addEventListener('balance', () => {
      this.emit('balance', this.balance)
    })
  }

  private listenSession() {
    SessionStorage.subscribeChanges(async (key, newValue) => {
      console.log('[Account] session event', key, newValue)
      if (key !== 'session') return

      if (newValue) {
        await this.addresses.import(PublicKeyGenerator.fromXPub(newValue.publicKey))
        await this.transactions.import(newValue.encryptedKey)
        await this.processor.start()
      } else {
        this.addresses.reset()
        this.transactions.reset()
        await this.processor.stop()
        await this.context.clear()
      }
    })
  }
}
