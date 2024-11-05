import {
  Address,
  createInputSignature,
  createTransactions,
  estimateTransactions,
  IGeneratorSettingsObject,
  IUtxoEntry,
  kaspaToSompi,
  Mnemonic,
  PendingTransaction,
  PrivateKeyGenerator,
  RpcClient,
  ScriptBuilder,
  signTransaction,
  sompiToKaspaString,
  Transaction,
  UtxoContext,
  UtxoProcessor,
  UtxoProcessorEvent,
  UtxoProcessorNotificationCallback,
  XPrv,
} from '@/wasm'
import AccountAddresses from './AccountAddresses'
import EventEmitter from 'events'
import KeyManager from '@/wallet/kaspa/KeyManager'
import AccountManager from '@/wallet/kaspa/account/AccountManager'
import { Token } from '../krc20/KRC20TransactionSetup'
import { CustomInput, CustomSignature, KRC20TokenRequest } from '@/utils/interfaces'
import { KRC20_COMMIT_AMOUNT } from '@/utils/constants'
import {
  estimateKRC20TransactionFee,
  getKRC20Info,
  submitKRC20Commit,
  submitKRC20Reveal,
  estimateKRC20MintFees,
  doKRC20Mint,
} from '../krc20/KRC20TransactionHandlers'

export default class AccountTransactions extends EventEmitter {
  kaspa: RpcClient
  context: UtxoContext
  processor: UtxoProcessor
  addresses: AccountAddresses
  account: AccountManager | null = null
  encryptedKey: string | undefined

  private transactions: Map<string, PendingTransaction> = new Map()

  constructor(kaspa: RpcClient, context: UtxoContext, processor: UtxoProcessor, addresses: AccountAddresses) {
    super()
    this.kaspa = kaspa
    this.context = context
    this.processor = processor
    this.addresses = addresses
  }

  setAccount(account: AccountManager) {
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

    const decryptedKey = KeyManager.getKey()
    if (!decryptedKey) {
      console.error('[AccountTransactions] No decrypted key available in KeyManager.')
      throw Error('No decrypted key available in KeyManager.')
    }

    const mnemonic = new Mnemonic(decryptedKey)
    const seed = mnemonic.toSeed() // This should be a 64-byte buffer
    const xprv = new XPrv(seed)
    const keyGenerator = new PrivateKeyGenerator(xprv, false, 0n)
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

  async submitKRC20Transaction(info: KRC20TokenRequest, feeRate: number) {
    const transactionContext = new UtxoContext({ processor: this.processor })
    transactionContext.trackAddresses([info.scriptAddress])

    const commit = await this.submitKRC20Commit(info.scriptAddress, feeRate)
    const commitId = commit[commit.length - 1]

    await this.waitForUTXO(commitId)

    const reveal = await this.submitKRC20Reveal(commitId, info, feeRate)
    const revealId = reveal[reveal.length - 1]

    transactionContext.clear()
    return [commitId, revealId]
  }

  async createForKRC20Mint(
    context: UtxoContext,
    fee: string,
    customs?: CustomInput[],
    changeAddress?: string,
  ): Promise<[string[], string]> {
    let priorityEntries: IUtxoEntry[] = []

    if (customs && customs.length > 0) {
      priorityEntries = await this.findCustomEntries(customs)
    }

    const feeSompi = kaspaToSompi(fee)!

    const estimatePreparedTxn: IGeneratorSettingsObject = {
      priorityEntries,
      entries: context,
      outputs: [],
      changeAddress: changeAddress ?? this.addresses.receiveAddresses[0],
      priorityFee: feeSompi,
      feeRate: 1,
    }

    const estimateSummary = await estimateTransactions(estimatePreparedTxn)
    const newPriorityFeeSompi = feeSompi - estimateSummary.mass

    const preparedTxn: IGeneratorSettingsObject = {
      priorityEntries,
      entries: context,
      outputs: [],
      changeAddress: changeAddress ?? this.addresses.receiveAddresses[0],
      priorityFee: newPriorityFeeSompi,
      feeRate: 1,
    }

    const { transactions, summary } = await createTransactions(preparedTxn)

    for (const transaction of transactions) {
      this.transactions.set(transaction.id, transaction)
    }

    const transactionStrings = transactions.map((transaction) => transaction.serializeToSafeJSON())
    return [transactionStrings, sompiToKaspaString(summary.fees)]
  }

  async submitKRC20MintReveal(
    context: UtxoContext,
    commitId: string,
    scriptAddress: string,
    sender: string,
    script: string,
    fee: string,
    backToScript: boolean,
  ) {
    const input = {
      address: scriptAddress,
      outpoint: commitId,
      index: 0,
      signer: sender,
      script: script,
    }

    const [reveal1] = await this.createForKRC20Mint(
      context,
      fee,
      [input],
      backToScript ? scriptAddress : undefined,
    )

    const reveal2 = await this.sign(reveal1, [input])
    return await this.submitContextful(reveal2)
  }

  async estimateKRC20MintFees(ticker: string, feeRate: number, timesToMint = 1) {
    return await estimateKRC20MintFees(this.addresses, this.context, ticker, feeRate, timesToMint)
  }

  async estimateKRC20TransactionFee(info: KRC20TokenRequest, feeRate: number) {
    return await estimateKRC20TransactionFee(this.context, this.addresses, info, feeRate)
  }

  async getKRC20Info(recipient: string, token: Token, amount: string): Promise<KRC20TokenRequest> {
    return await getKRC20Info(this.addresses, recipient, token, amount)
  }

  async submitKRC20Commit(
    scriptAddress: string,
    feeRate: number,
    amount: string = KRC20_COMMIT_AMOUNT,
    additionalOutputs: [string, string][] = [],
  ) {
    return await submitKRC20Commit(
      this.create.bind(this),
      this.sign.bind(this),
      this.submitContextful.bind(this),
      scriptAddress,
      feeRate,
      amount,
      additionalOutputs,
    )
  }

  async submitKRC20Reveal(commitId: string, info: KRC20TokenRequest, feeRate: number) {
    return await submitKRC20Reveal(
      this.create.bind(this),
      this.sign.bind(this),
      this.submitContextful.bind(this),
      commitId,
      this.context,
      info,
      feeRate,
    )
  }

  async doKRC20Mint(ticker: string, feeRate: number, timesToMint = 1) {
    return await doKRC20Mint(
      this.submitKRC20Commit.bind(this),
      this.submitKRC20MintReveal.bind(this),
      this.waitForUTXO.bind(this),
      this.addresses,
      this.processor,
      ticker,
      feeRate,
      timesToMint,
    )
  }

  async waitForUTXO(transactionID: string) {
    return new Promise<void>((resolve) => {
      const listener = (event: UtxoProcessorEvent<'maturity'>) => {
        console.log(event)

        if (event.data.id.toString() === transactionID) {
          // i think the types for the callback are wrong?
          this.processor.removeEventListener('maturity', listener as UtxoProcessorNotificationCallback)
          resolve()
        }
      }
      this.processor.addEventListener('maturity', listener)
    })
  }

  reset() {
    delete this.encryptedKey
  }
}
