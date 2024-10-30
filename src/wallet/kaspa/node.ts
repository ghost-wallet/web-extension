import { EventEmitter } from 'events'
import { RpcClient, Transaction, Resolver, NetworkId, IFeerateBucket, ConnectStrategy } from '@/wasm'

export type PriorityBuckets = Record<'slow' | 'standard' | 'fast', { feeRate: number; seconds: number }>

export default class Node extends EventEmitter {
  rpcClient: RpcClient
  networkId: string = 'mainnet'

  constructor() {
    super()
    this.rpcClient = new RpcClient()
    this.registerEvents()
    console.log('[Node] Initialized Node instance')
  }

  get connected() {
    return this.rpcClient.isConnected
  }

  waitUntilConnected() {
    return new Promise<void>((resolve) => {
      if (this.connected) {
        resolve()
      }
      const listener = () => {
        this.rpcClient.removeEventListener('connect', listener)
        resolve()
      }
      this.rpcClient.addEventListener('connect', listener)
    })
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
    await this.rpcClient.disconnect()

    console.log('[Node] Attempting to connect to:', nodeAddress)

    if (!nodeAddress.startsWith('ws')) {
      if (!this.rpcClient.resolver) this.rpcClient.setResolver(new Resolver())
      this.rpcClient.setNetworkId(new NetworkId(nodeAddress))
    }

    await this.rpcClient.connect({
      blockAsyncConnect: true,
      url: nodeAddress.startsWith('ws') ? nodeAddress : undefined,
      strategy: ConnectStrategy.Retry,
      timeoutDuration: 2000,
      retryInterval: 1000,
    })

    console.log('[Node] Successfully connected to:', nodeAddress)

    const { isSynced, hasUtxoIndex, networkId, serverVersion, rpcApiVersion } =
      await this.rpcClient.getServerInfo()

    console.log(
      `[Node] Connected to node with server version ${serverVersion} and RPC API version ${rpcApiVersion}`,
    )

    if (!isSynced || !hasUtxoIndex) {
      await this.rpcClient.disconnect()
      console.error('Node is not synchronized or lacks UTXO index.')
      throw Error('Node is not synchronized or lacks UTXO index.')
    }

    if (this.networkId !== networkId) {
      console.log(`[Node] Network ID changed from ${this.networkId} to ${networkId}`)
      this.emit('network', networkId)
      this.networkId = networkId
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
