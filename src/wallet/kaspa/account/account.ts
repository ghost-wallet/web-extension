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

  async compoundUtxos() {
    console.log('[Account] Consolidating UTXOs across all addresses...')
    const allAddresses = [...this.addresses.receiveAddresses, ...this.addresses.changeAddresses]

    const { entries } = await this.processor.rpc.getUtxosByAddresses(allAddresses)
    console.log('[Account] UTXOs:', entries)
    if (!entries || entries.length === 0) {
      console.log('[Account] No UTXOs available for consolidation.')
      return
    }

    const utxoEntrySource = entries.map((utxo) => ({
      outpoint: {
        transactionId: utxo.outpoint.transactionId,
        index: utxo.outpoint.index,
      },
      amount: BigInt(utxo.amount), // UTXO amount as BigInt
      scriptPublicKey: {
        version: utxo.scriptPublicKey.version,
        script: utxo.scriptPublicKey.script,
      },
      blockDaaScore: BigInt(utxo.blockDaaScore),
      isCoinbase: utxo.isCoinbase,
    }))

    const receiveAddress = this.addresses.receiveAddresses[0]
    const totalAmount = utxoEntrySource.reduce((sum, utxo) => sum + utxo.amount, BigInt(0))

    const fee = BigInt(10000) // Fee as a BigInt (0.0001 KAS in sompis)
    const amountToSend = totalAmount - fee

    if (amountToSend <= BigInt(0)) {
      console.error(
        'Insufficient funds to cover the fee. Available:',
        totalAmount.toString(),
        'Required (including fee):',
        fee.toString(),
      )
      return
    }

    const outputs: [string, string][] = [[receiveAddress, (amountToSend / BigInt(1e8)).toString()]]

    const feeRate = 1 // Example fee rate

    try {
      const serializedPendingTransactions = await this.transactions.create(
        outputs,
        feeRate,
        (fee / BigInt(1e8)).toString(),
      )

      const signedConsolidationTransaction = await this.transactions.sign(serializedPendingTransactions)
      const consolidationTransactionId = await this.transactions.submitContextful(
        signedConsolidationTransaction,
      )
      console.log('[Account] Consolidation transaction submitted:', consolidationTransactionId)

      return consolidationTransactionId
    } catch (error) {
      console.error('[Account] Error consolidating UTXOs:', error)
      throw error
    }
  }

  async scan(quick = false): Promise<[number, number]> {
    console.log('[Account] Scan started')
    console.log('[Account] Scan: current receive addresses', this.addresses.receiveAddresses)
    console.log('[Account] Scan: current change addresses', this.addresses.changeAddresses)
    


    const receive = await this.scanAddresses(true, this.addresses.receiveAddresses.length, quick ? 8 : 64)
    const change = await this.scanAddresses(false, this.addresses.changeAddresses.length, quick ? 128 : 1024, 128)


    console.log('[Account] Scan complete')
    console.log('[Account] Scan: current receive addresses', this.addresses.receiveAddresses)
    console.log('[Account] Scan: current change addresses', this.addresses.changeAddresses)

    return [receive, change]
  }

  private async scanAddresses(isReceive: boolean, start: number, maxEmpty: number, windowSize = 8) {
    console.log(`[Account] Starting Scan for ${isReceive ? 'recieve' : 'change'} addresses. Starting at ${start}.`)
    let index = start
    let foundIndex = start
    do {
      console.log('current index', index)
      console.log('current foundIndex', foundIndex)
      const addresses = await this.addresses.derive(isReceive, index, index + windowSize)
      const { entries } = await this.processor.rpc.getUtxosByAddresses(addresses)
      console.log('entries', entries)
      const entryIndex = addresses.findLastIndex((address) =>
        entries.some((entry) => entry.address?.toString() === address),
      )
      console.log('last entry index', entryIndex)
      if (entryIndex !== -1) {
        foundIndex = index + entryIndex
      }
      index += windowSize
    } while(index - foundIndex < maxEmpty)
    const numToIncrement = foundIndex - start
    console.log('numToIncrement', numToIncrement)
    if(numToIncrement > 0) {
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
