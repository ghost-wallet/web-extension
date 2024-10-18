import { EventEmitter } from 'events'
import { RpcClient, Transaction, Resolver, NetworkId, IFeerateBucket } from '@/wasm'

export type PriorityBuckets = Record<'slow' | 'standard' | 'fast', { feeRate: number; seconds: number }>

export default class Node extends EventEmitter {
  rpcClient: RpcClient
  networkId: string = 'MAINNET'

  constructor() {
    super()
    this.rpcClient = new RpcClient()
    this.registerEvents()
    console.log('[Node] Initialized Node instance')
  }

  get connected() {
    return this.rpcClient.isConnected
  }

  async getPriorityBuckets() {
    const { estimate } = await this.rpcClient.getFeeEstimate({})
    console.log('[Node] Fee estimate:', estimate)

    const getBucketEstimate = (bucket: IFeerateBucket) => ({
      feeRate: bucket.feerate,
      seconds: bucket.estimatedSeconds,
    })

    const priorityBuckets = {
      slow: getBucketEstimate(estimate.lowBuckets[0]),
      standard: getBucketEstimate(estimate.normalBuckets[0]),
      fast: getBucketEstimate(estimate.priorityBucket),
    }

    console.log('[Node] Priority buckets:', priorityBuckets)
    return priorityBuckets
  }

  async submit(transactions: string[]) {
    console.log('[Node] Submitting transactions:', transactions)
    const submittedIds: string[] = []

    for (const transaction of transactions) {
      const { transactionId } = await this.rpcClient.submitTransaction({
        transaction: Transaction.deserializeFromSafeJSON(transaction),
      })

      console.log(`[Node] Transaction submitted. ID: ${transactionId}`)
      submittedIds.push(transactionId)
    }

    console.log('[Node] All transaction IDs:', submittedIds)
    return submittedIds
  }

  async reconnect(nodeAddress: string) {
    console.log(`[Node] Reconnecting to: ${nodeAddress}`)

    try {
      await this.rpcClient.disconnect()
      console.log('[Node] Disconnected from current node')

      if (!this.rpcClient.resolver) {
        console.log('[Node] Setting new resolver')
        this.rpcClient.setResolver(new Resolver())
      }
      console.log('[Node] Setting network ID for:', nodeAddress)
      this.rpcClient.setNetworkId(new NetworkId(nodeAddress))

      console.log('[Node] Attempting to connect to:', nodeAddress)

      // Run connect in a long-running, independent process
      this.rpcClient
        .connect()
        .then(() => {
          console.log('[Node] Successfully connected to:', nodeAddress)
          this.rpcClient
            .getServerInfo()
            .then(({ isSynced, hasUtxoIndex, networkId }) => {
              console.log('[Node] Server info:', { isSynced, hasUtxoIndex, networkId })

              if (!isSynced || !hasUtxoIndex) {
                console.error('[Node] Node is not synchronized or lacks UTXO index. Disconnecting...')
                this.rpcClient.disconnect().catch((disconnectError) => {
                  console.error('[Node] Error during disconnect:', disconnectError)
                })
                throw Error('Node is not synchronized or lacks UTXO index.')
              }

              if (this.networkId !== networkId) {
                console.log(`[Node] Network ID changed from ${this.networkId} to ${networkId}`)
                this.emit('network', networkId)
                this.networkId = networkId
              } else {
                console.log('[Node] Network ID remains unchanged:', this.networkId)
              }
            })
            .catch((error) => {
              console.error('[Node] Error fetching server info:', error)
            })
        })
        .catch((connectError) => {
          console.error('[Node] Connection attempt failed:', connectError)
          // Optionally, you could implement retry logic here if needed
        })
    } catch (error) {
      console.error('[Node] Reconnection process encountered an error:', error)
      throw error
    }
  }

  private registerEvents() {
    this.rpcClient.addEventListener('connect', () => {
      console.log('[Node] Connected to the node')
      this.emit('connection', true)
    })

    this.rpcClient.addEventListener('disconnect', () => {
      console.log('[Node] Disconnected from the node')
      this.emit('connection', false)
    })
  }
}
