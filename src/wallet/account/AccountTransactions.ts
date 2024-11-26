import {
  Address,
  createInputSignature,
  createTransactions,
  estimateTransactions,
  IGeneratorSettingsObject,
  IUtxoEntry,
  kaspaToSompi,
  PendingTransaction,
  RpcClient,
  ScriptBuilder,
  signTransaction,
  sompiToKaspaString,
  Transaction,
  UtxoContext,
  UtxoProcessor,
} from '@/wasm'
import AccountAddresses from './AccountAddresses'
import EventEmitter from 'events'
import KeyManager from '@/wallet/account/KeyManager'
import Account from '@/wallet/Account'
import { CustomInput, CustomSignature } from '@/utils/interfaces'

export default class AccountTransactions extends EventEmitter {
  kaspa: RpcClient
  context: UtxoContext
  processor: UtxoProcessor
  addresses: AccountAddresses
  account: Account | null = null
  encryptedKey: string | undefined

  private transactions: Map<string, PendingTransaction> = new Map()

  constructor(kaspa: RpcClient, context: UtxoContext, processor: UtxoProcessor, addresses: AccountAddresses) {
    super()
    this.kaspa = kaspa
    this.context = context
    this.processor = processor
    this.addresses = addresses
  }

  setAccount(account: Account) {
    this.account = account
  }

  async import(encryptedKey: string) {
    this.encryptedKey = encryptedKey
  }

  async findCustomEntries(customs: CustomInput[]) {
    let priorityEntries: IUtxoEntry[] = []

    console.log(customs)
    const { entries } = await this.kaspa.getUtxosByAddresses({
      addresses: customs.map((custom) => custom.address),
    })
    console.log(entries)
    for (const custom of customs) {
      const matchingEntry = entries.find(
        ({ outpoint }) => outpoint.transactionId === custom.outpoint && outpoint.index === custom.index,
      )

      if (matchingEntry) {
        priorityEntries.push(matchingEntry)
      } else throw Error('Failed to resolve custom entry')
    }

    return priorityEntries
  }

  async estimateKaspaTransactionFee(outputs: [string, string][], feeRate: number, fee: string) {
    const preparedTxn = {
      entries: this.context,
      outputs: outputs.map((output) => ({
        address: output[0],
        amount: kaspaToSompi(output[1])!,
      })),
      changeAddress: this.addresses.receiveAddresses[0],
      feeRate,
      priorityFee: kaspaToSompi(fee)!,
    }

    const estimate = await estimateTransactions(preparedTxn)

    return sompiToKaspaString(estimate.fees)
  }

  async create(
    outputs: [string, string][],
    feeRate: number | undefined,
    fee: string,
    customs?: CustomInput[],
    changeAddress?: string,
  ): Promise<[string[], string]> {
    let priorityEntries: IUtxoEntry[] = []

    if (customs && customs.length > 0) {
      priorityEntries = await this.findCustomEntries(customs)
    }

    const preparedTxn = {
      priorityEntries,
      entries: this.context,
      outputs: outputs.map((output) => ({
        address: output[0],
        amount: kaspaToSompi(output[1])!,
      })),
      changeAddress: changeAddress ?? this.addresses.receiveAddresses[0],
      feeRate,
      priorityFee: kaspaToSompi(fee)!,
    }
    const { transactions, summary } = await createTransactions(preparedTxn)

    for (const transaction of transactions) {
      this.transactions.set(transaction.id, transaction)
    }

    const transactionStrings = transactions.map((transaction) => transaction.serializeToSafeJSON())
    return [transactionStrings, sompiToKaspaString(summary.fees)]
  }

  async sign(transactions: string[], customs: CustomSignature[] = []) {
    if (!this.encryptedKey) {
      console.error('[AccountTransactions] No imported account available for signing.')
      throw Error('No imported account')
    }

    const keyGenerator = KeyManager.createKeyGenerator()
    const signedTransactions: Transaction[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const privateKeys = []

      for (let address of parsedTransaction.addresses(this.addresses.networkId)) {
        if (address.version === 'ScriptHash') {
          continue
        }
        //TODO update this for multiple receive addresses
        const [isReceive, index] = this.addresses.findIndexes(address.toString())
        privateKeys.push(isReceive ? keyGenerator.receiveKey(index) : keyGenerator.changeKey(index))
      }
      const signedTransaction = signTransaction(parsedTransaction, privateKeys, false)

      for (const custom of customs) {
        const inputIndex = signedTransaction.inputs.findIndex(
          ({ previousOutpoint }) =>
            previousOutpoint.transactionId === custom.outpoint && previousOutpoint.index === custom.index,
        )

        if (Address.validate(custom.signer)) {
          if (!custom.script) throw Error('Script is required when signer address is supplied')

          const [isReceive, index] = this.addresses.findIndexes(custom.signer)
          const privateKey = isReceive ? keyGenerator.receiveKey(index) : keyGenerator.changeKey(index)

          signedTransaction.inputs[inputIndex].signatureScript = ScriptBuilder.fromScript(
            custom.script,
          ).encodePayToScriptHashSignatureScript(
            createInputSignature(signedTransaction, inputIndex, privateKey),
          )
        } else {
          signedTransaction.inputs[inputIndex].signatureScript = custom.signer
        }
      }

      signedTransactions.push(signedTransaction)
    }
    return signedTransactions.map((transaction) => transaction.serializeToSafeJSON())
  }

  async submitContextful(transactions: string[]) {
    const submittedIds: string[] = []

    for (const transaction of transactions) {
      const parsedTransaction = Transaction.deserializeFromSafeJSON(transaction)
      const cachedTransaction = this.transactions.get(parsedTransaction.id)

      if (!cachedTransaction) throw Error('Transaction is not generated by wallet, use Node.submit().')

      for (let i = 0; i < parsedTransaction.inputs.length; i++) {
        const input = parsedTransaction.inputs[i]
        cachedTransaction.fillInput(i, input.signatureScript)
      }

      submittedIds.push(await cachedTransaction.submit(this.kaspa))
    }

    this.emit('transaction', transactions[transactions.length - 1])
    return submittedIds
  }

  async submitKaspaTransaction(transactions: string[], customs: CustomSignature[] = []) {
    const signed = await this.sign(transactions, customs)
    return await this.submitContextful(signed)
  }

  reset() {
    delete this.encryptedKey
  }
}
