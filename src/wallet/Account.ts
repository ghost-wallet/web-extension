import { EventEmitter } from 'events'
import { UtxoContext, UtxoProcessor, PublicKeyGenerator, UtxoEntryReference } from '@/wasm'
import type Node from './Node'
import AccountAddresses from './account/AccountAddresses'
import SessionStorage from '@/storage/SessionStorage'
import AccountTransactions from './account/AccountTransactions'
import KRC20Transactions from './krc20/KRC20Transactions'

export default class Account extends EventEmitter {
  processor: UtxoProcessor
  addresses: AccountAddresses
  context: UtxoContext
  transactions: AccountTransactions
  krc20Transactions: KRC20Transactions
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
    this.addresses = new AccountAddresses(this.context, node.networkId)
    this.transactions = new AccountTransactions(node.rpcClient, this.context, this.processor, this.addresses)
    this.krc20Transactions = new KRC20Transactions(node.rpcClient, this.context, this.processor, this.addresses, this.transactions)
    this.transactions.setAccount(this)

    node.on('network', async (networkId: string) => {
      console.log('[Account] network event', networkId)

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
