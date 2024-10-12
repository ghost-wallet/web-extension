import {
  XPrv,
  Mnemonic,
  createTransactions,
  IUtxoEntry,
  kaspaToSompi,
  PendingTransaction,
  PrivateKeyGenerator,
  RpcClient,
  signTransaction,
  Transaction,
  UtxoContext,
} from '@/wasm'
import Addresses from './addresses'
import EventEmitter from 'events'
import KeyManager from '@/wallet/kaspa/KeyManager'

export interface CustomInput {
  address: string
  outpoint: string
  index: number
}

export interface CustomSignature {
  outpoint: string
  index: number
  signer: string
  script?: string
}

export default class Transactions extends EventEmitter {
  kaspa: RpcClient
  context: UtxoContext
  addresses: Addresses
  encryptedKey: string | undefined
  accountId: number | undefined

  private transactions: Map<string, PendingTransaction> = new Map()

  constructor(kaspa: RpcClient, context: UtxoContext, addresses: Addresses) {
    super()

    this.kaspa = kaspa
    this.context = context
    this.addresses = addresses
  }

  async import(encryptedKey: string, accountId: number) {
    this.encryptedKey = encryptedKey
    this.accountId = accountId
  }

  async create(outputs: [string, string][], feeRate: number, fee: string, customs?: CustomInput[]) {
    let priorityEntries: IUtxoEntry[] = []

    if (customs && customs.length > 0) {
      const { entries } = await this.kaspa.getUtxosByAddresses({
        addresses: customs.map((custom) => custom.address),
      })
      for (const custom of customs) {
        const matchingEntry = entries.find(
          ({ outpoint }) =>
            outpoint.transactionId === custom.outpoint && outpoint.index === custom.index,
        )

        if (matchingEntry) {
          priorityEntries.push(matchingEntry)
        } else throw Error('Failed to resolve custom entry')
      }
    }

    const { transactions } = await createTransactions({
      priorityEntries,
      entries: this.context,
      outputs: outputs.map((output) => ({
        address: output[0],
        amount: kaspaToSompi(output[1])!,
      })),
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: kaspaToSompi(fee)!,
    })

    await this.addresses.increment(0, 1)

    for (const transaction of transactions) {
      this.transactions.set(transaction.id, transaction)
    }

    return transactions.map((transaction) => transaction.serializeToSafeJSON())
  }

  async sign(transactions: string[]) {
    if (!this.encryptedKey) {
      console.error('[Transactions] No imported account available for signing.')
      throw Error('No imported account')
    }

    const decryptedKey = KeyManager.getKey()
    if (!decryptedKey) {
      console.error('[Transactions] No decrypted key available in KeyManager.')
      throw Error('No decrypted key available in KeyManager.')
    }

    const mnemonic = new Mnemonic(decryptedKey)
    const seed = mnemonic.toSeed() // This should be a 64-byte buffer
    const xprv = new XPrv(seed)
    const keyGenerator = new PrivateKeyGenerator(xprv, false, BigInt(this.accountId!))
    const signedTransactions: Transaction[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const privateKeys = []
      for (let address of parsedTransaction.addresses(this.addresses.networkId)) {
        if (address.version === 'ScriptHash') {
          continue
        }
        const [isReceive, index] = this.addresses.findIndexes(address.toString())
        privateKeys.push(isReceive ? keyGenerator.receiveKey(index) : keyGenerator.changeKey(index))
      }

      const signedTransaction = signTransaction(parsedTransaction, privateKeys, false)
      signedTransactions.push(signedTransaction)
    }
    return signedTransactions.map((transaction) => transaction.serializeToSafeJSON())
  }

  async submitContextful(transactions: string[]) {
    const submittedIds: string[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const cachedTransaction = this.transactions.get(parsedTransaction.id)

      if (!cachedTransaction)
        throw Error('Transaction is not generated by wallet, use Node.submit().')

      for (let i = 0; i < parsedTransaction.inputs.length; i++) {
        const input = parsedTransaction.inputs[i]
        cachedTransaction.fillInput(i, input.signatureScript)
      }

      submittedIds.push(await cachedTransaction.submit(this.kaspa))
    }

    this.emit('transaction', transactions[transactions.length - 1])
    return submittedIds
  }

  reset() {
    delete this.encryptedKey
    delete this.accountId
  }
}
