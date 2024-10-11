import { EventEmitter } from 'events'
import {
  RpcClient,
  ConnectStrategy,
  Transaction,
  Resolver,
  NetworkId,
  IFeerateBucket,
} from '@/wasm'

export type PriorityBuckets = Record<
  'slow' | 'standard' | 'fast',
  { feeRate: number; seconds: number }
>

export default class Node extends EventEmitter {
  kaspa: RpcClient
  networkId: string = 'MAINNET'

  constructor() {
    super()
    console.info('[Node] node.ts class initialized.')

    this.kaspa = new RpcClient()
    this.registerEvents()
  }

  get connected() {
    return this.kaspa.isConnected
  }

  async getPriorityBuckets() {
    try {
      const { estimate } = await this.kaspa.getFeeEstimate({})
      const getBucketEstimate = (bucket: IFeerateBucket) => ({
        feeRate: bucket.feerate,
        seconds: bucket.estimatedSeconds,
      })

      return {
        slow: getBucketEstimate(estimate.lowBuckets[0]),
        standard: getBucketEstimate(estimate.normalBuckets[0]),
        fast: getBucketEstimate(estimate.priorityBucket),
      }
    } catch (error) {
      console.error('Error fetching priority buckets:', error)
      throw error
    }
  }

  async submit(transactions: string[]) {
    const submittedIds: string[] = []

    try {
      for (const transaction of transactions) {
        const { transactionId } = await this.kaspa.submitTransaction({
          transaction: Transaction.deserializeFromSafeJSON(transaction),
        })
        submittedIds.push(transactionId)
      }

      return submittedIds
    } catch (error) {
      console.error('Error submitting transactions:', error)
      throw error
    }
  }

  async reconnect(nodeAddress: string) {
    try {
      await this.kaspa.disconnect()

      if (!nodeAddress.startsWith('ws')) {
        if (!this.kaspa.resolver) {
          this.kaspa.setResolver(new Resolver())
        }
        this.kaspa.setNetworkId(new NetworkId(nodeAddress))
      }

      await this.kaspa.connect({
        blockAsyncConnect: true,
        url: nodeAddress.startsWith('ws') ? nodeAddress : undefined,
        strategy: ConnectStrategy.Retry,
        timeoutDuration: 2000,
        retryInterval: 1000,
      })

      const { isSynced, hasUtxoIndex, networkId } = await this.kaspa.getServerInfo()

      if (!isSynced || !hasUtxoIndex) {
        await this.kaspa.disconnect()
        throw new Error('Node is not synchronized or lacks UTXO index.')
      }

      if (this.networkId !== networkId) {
        this.emit('network', networkId)
        this.networkId = networkId
      }
    } catch (error) {
      console.error('Error during node reconnection:', error)
      throw error
    }
  }

  private registerEvents() {
    this.kaspa.addEventListener('connect', () => {
      this.emit('connection', true)
    })

    this.kaspa.addEventListener('disconnect', () => {
      this.emit('connection', false)
    })
  }
}
