import { EventEmitter } from "events"
import { RpcClient, ConnectStrategy, Transaction, Resolver, NetworkId, IFeerateBucket } from "@/wasm"

export type PriorityBuckets = Record<'slow' | 'standard' | 'fast', { feeRate: number; seconds: number }>

export default class Node extends EventEmitter {
  kaspa: RpcClient
  networkId: string = "MAINNET"

  constructor () {
    super()

    this.kaspa = new RpcClient()
    this.registerEvents()
  }

  get connected () {
    return this.kaspa.isConnected
  }

  async getPriorityBuckets () {
    const { estimate } = await this.kaspa.getFeeEstimate({})

    const getBucketEstimate = (bucket: IFeerateBucket) => ({
      feeRate: bucket.feerate,
      seconds: bucket.estimatedSeconds,
    })

    return {
      slow: getBucketEstimate(estimate.lowBuckets[0]),
      standard: getBucketEstimate(estimate.normalBuckets[0]),
      fast: getBucketEstimate(estimate.priorityBucket)
    }
  }

  async submit (transactions: string[]) {
    const submittedIds: string[] = []

    for (const transaction of transactions) {
      const { transactionId } = await this.kaspa.submitTransaction({
        transaction: Transaction.deserializeFromSafeJSON(transaction)
      })

      submittedIds.push(transactionId)
    }

    return submittedIds
  }

  async reconnect (nodeAddress: string) {
    // Disconnect safely if connected
    if (this.kaspa.isConnected) {
      await this.kaspa.disconnect()
    }

    if (!nodeAddress.startsWith('ws')) {
      if (!this.kaspa.resolver) this.kaspa.setResolver(new Resolver())
      this.kaspa.setNetworkId(new NetworkId(nodeAddress))
    }

    try {
      await this.kaspa.connect({
        blockAsyncConnect: true,
        url: nodeAddress.startsWith('ws') ? nodeAddress : undefined,
        strategy: ConnectStrategy.Retry,
        timeoutDuration: 5000, // Increase timeout to avoid premature closure
        retryInterval: 2000,
      })
    } catch (error) {
      console.error('WebSocket connection error:', error)
      throw new Error('Failed to establish WebSocket connection.')
    }

    const { isSynced, hasUtxoIndex, networkId } = await this.kaspa.getServerInfo()

    if (!isSynced || !hasUtxoIndex) {
      await this.kaspa.disconnect()
      throw Error('Node is not synchronized or lacks UTXO index.')
    }

    if (this.networkId !== networkId) {
      this.emit('network', networkId)
      this.networkId = networkId
    }
  }

  private registerEvents () {
    this.kaspa.addEventListener('connect', () => {
      this.emit('connection', true)
    })

    this.kaspa.addEventListener('disconnect', () => {
      console.warn('Disconnected from WebSocket, retrying...')
      this.emit('connection', false)

      // Retry connection when disconnected
      setTimeout(() => {
        if (!this.kaspa.isConnected) {
          // You might want to use a default node address or the current networkId
          this.reconnect(this.networkId).catch((err) => console.error('Reconnect error:', err))
        }
      }, 5000) // Retry after 5 seconds
    })
  }
}
