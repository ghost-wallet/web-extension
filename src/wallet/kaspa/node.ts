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
    console.info('node.ts: Node class initialized.')

    this.kaspa = new RpcClient()
    this.registerEvents()
  }

  get connected() {
    return this.kaspa.isConnected
  }

  async getPriorityBuckets() {
    console.info('node.ts: Fetching priority fee buckets...')
    try {
      const { estimate } = await this.kaspa.getFeeEstimate({})
      console.info('node.ts: Priority fee buckets fetched successfully:', estimate)

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
      console.error('node.ts: Error fetching priority buckets:', error)
      throw error
    }
  }

  async submit(transactions: string[]) {
    console.info('node.ts: Submitting transactions...')
    const submittedIds: string[] = []

    try {
      for (const transaction of transactions) {
        console.info('node.ts: Submitting transaction:', transaction)
        const { transactionId } = await this.kaspa.submitTransaction({
          transaction: Transaction.deserializeFromSafeJSON(transaction),
        })

        submittedIds.push(transactionId)
        console.info('node.ts: Transaction submitted successfully, ID:', transactionId)
      }

      return submittedIds
    } catch (error) {
      console.error('node.ts: Error submitting transactions:', error)
      throw error
    }
  }

  async reconnect(nodeAddress: string) {
    console.warn(`node.ts: Reconnecting to node at address: ${nodeAddress}...`)

    try {
      console.warn('node.ts: Disconnecting from the current node...')
      await this.kaspa.disconnect()

      if (!nodeAddress.startsWith('ws')) {
        console.warn('node.ts: Using non-WebSocket connection; setting resolver and network ID...')
        if (!this.kaspa.resolver) {
          console.warn('node.ts: No resolver found; setting a new one.')
          this.kaspa.setResolver(new Resolver())
        }
        this.kaspa.setNetworkId(new NetworkId(nodeAddress))
      }

      console.info('node.ts: Connecting to the new node...')
      await this.kaspa.connect({
        blockAsyncConnect: true,
        url: nodeAddress.startsWith('ws') ? nodeAddress : undefined,
        strategy: ConnectStrategy.Retry,
        timeoutDuration: 2000,
        retryInterval: 1000,
      })

      console.info('node.ts: Fetching server information for node synchronization...')
      const { isSynced, hasUtxoIndex, networkId } = await this.kaspa.getServerInfo()

      if (!isSynced || !hasUtxoIndex) {
        console.error('node.ts: Node is not synchronized or lacks UTXO index. Disconnecting...')
        await this.kaspa.disconnect()
        throw new Error('Node is not synchronized or lacks UTXO index.')
      }

      console.info('node.ts: Node synchronization verified. Node is synced and has a UTXO index.')
      if (this.networkId !== networkId) {
        console.warn(
          `node.ts: Network ID changed from ${this.networkId} to ${networkId}. Updating...`,
        )
        this.emit('network', networkId)
        this.networkId = networkId
      } else {
        console.info('node.ts: Network ID remains unchanged.')
      }

      console.info('node.ts: Reconnection process completed successfully.')
    } catch (error) {
      console.error('node.ts: Error occurred during node reconnection:', error)
      throw error
    }
  }

  private registerEvents() {
    console.info('node.ts: Registering Kaspa event listeners...')

    this.kaspa.addEventListener('connect', () => {
      console.info('node.ts: Kaspa connected event received.')
      this.emit('connection', true)
    })

    this.kaspa.addEventListener('disconnect', () => {
      console.warn('node.ts: Kaspa disconnected event received.')
      this.emit('connection', false)
    })
  }
}
