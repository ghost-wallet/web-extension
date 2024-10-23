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
  Address,
  ScriptBuilder,
  createInputSignature,
  UtxoProcessor,
  UtxoProcessorNotificationCallback,
  UtxoProcessorEvent,
  UtxoEntry,
  estimateTransactions,
  IGeneratorSettingsObject,
  ITransactionOutpoint,
  IScriptPublicKey,
  sompiToKaspaString,
} from '@/wasm'
import Addresses from './addresses'
import EventEmitter from 'events'
import KeyManager from '@/wallet/kaspa/KeyManager'
import Account from '@/wallet/kaspa/account/account'
import { KRC20Info, setupkrc20Transaction, Token } from '../krc20/Transact'

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
  processor: UtxoProcessor
  addresses: Addresses
  account: Account | null = null
  encryptedKey: string | undefined
  accountId: number | undefined

  private transactions: Map<string, PendingTransaction> = new Map()

  constructor(kaspa: RpcClient, context: UtxoContext, processor: UtxoProcessor, addresses: Addresses) {
    super()

    this.kaspa = kaspa
    this.context = context
    this.processor = processor
    this.addresses = addresses
  }

  setAccount(account: Account) {
    this.account = account
  }

  async import(encryptedKey: string, accountId: number) {
    this.encryptedKey = encryptedKey
    this.accountId = accountId
  }

  async findCustomEntries(customs: CustomInput[]) {
    let priorityEntries: IUtxoEntry[] = []

    console.log('customs:')
    console.log(customs)
    const { entries } = await this.kaspa.getUtxosByAddresses({
      addresses: customs.map((custom) => custom.address),
    })
    console.log('entries:')
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

  async estimateKaspaTransactions(outputs: [string, string][], feeRate: number, fee: string, customs?: CustomInput[]) {
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
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: kaspaToSompi(fee)!,
    }

    const summary = await estimateTransactions(preparedTxn)
    
    return summary
  }

  async create(outputs: [string, string][], feeRate: number, fee: string, customs?: CustomInput[]) {
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
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: kaspaToSompi(fee)!,
    }
    console.log('Creating transaction with:')
    console.log(preparedTxn)

    const { transactions, summary } = await createTransactions(preparedTxn)

    // TODO: Move this to later?
    await this.addresses.increment(0, 1)

    for (const transaction of transactions) {
      this.transactions.set(transaction.id, transaction)
    }

    return transactions.map((transaction) => transaction.serializeToSafeJSON())
  }

  async sign(transactions: string[], customs: CustomSignature[] = []) {
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

  async signTransactions(transactions: Transaction[], customs: CustomSignature[] = []) {
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
      const parsedTransaction = transaction
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
    return signedTransactions
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

  logFee(txn: Transaction) {
    const inputValue = txn.inputs.reduce((acc: bigint, input: any) => {
      return acc + BigInt(input.utxo!.amount)
    }, 0n)

    const outputValue = txn.outputs.reduce((acc: bigint, output: any) => {
      return acc + BigInt(output.value)
    }, 0n)

    console.log('inputValue', sompiToKaspaString(inputValue))
    console.log('outputValue', sompiToKaspaString(outputValue))
    console.log('fee', sompiToKaspaString(inputValue - outputValue))

    return inputValue - outputValue
  }

  logFeeFromJsonArray(input: string[]) {
    const transaction = Transaction.deserializeFromSafeJSON(input[input.length - 1])
    return this.logFee(transaction)
  }

  async estimateKRC20Transaction(recipient: string, token: Token, amount: string, feeRate: number) {
    const ourAddress = this.addresses.receiveAddresses[0]
    const { script, scriptAddress } = setupkrc20Transaction(ourAddress, recipient, amount, token)
  
    //const commit1 = await this.create([[scriptAddress, '0.2']], feeRate, '0')

    const commitSettings: IGeneratorSettingsObject = {
      priorityEntries: [],
      entries: this.context,
      outputs: [{
        address: scriptAddress,
        amount: kaspaToSompi('0.2')!
      }],
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: kaspaToSompi('0')!,
    }
    const commitResult = await createTransactions(commitSettings)

    console.log('[Transaction] estimateKRC20Transaction commitResult: ', commitResult)

    const commitTxn = commitResult.transactions[commitResult.transactions.length - 1]

    const commitSummary = commitResult.summary

    const commitOutput = commitTxn.transaction.outputs[0]

    const commitOutpoint: ITransactionOutpoint = {
      transactionId: commitTxn.id,
      index: 0
    }

    const commitUTXO: IUtxoEntry = {
      address: scriptAddress,
      outpoint: commitOutpoint,
      amount: commitOutput.value,
      scriptPublicKey: commitOutput.scriptPublicKey as IScriptPublicKey, // hopefully this works
      blockDaaScore: BigInt(0),
      isCoinbase: false
    }

    const revealSettings: IGeneratorSettingsObject = {
      priorityEntries: [commitUTXO],
      entries: this.context,
      outputs: [],
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: kaspaToSompi('0.01')!
    }

    console.log('[Transaction] estimateKRC20Transaction revealSettings: ', revealSettings)

    const revealEstimateResult = await estimateTransactions(revealSettings)
    //const revealResult = await createTransactions(revealSettings)
    
    //const revealEstimateResult = revealResult.summary

    console.log('[Transaction] estimateKRC20Transaction revealEstimateResult: ', revealEstimateResult)

    const totalFee = commitSummary.fees + revealEstimateResult.fees
    const totalAmount = commitSummary.finalAmount! + revealEstimateResult.finalAmount!

    console.log('[Transaction] estimateKRC20Transaction commitSummary.fees', sompiToKaspaString(commitSummary.fees))
    console.log('[Transaction] estimateKRC20Transaction commitSummary.finalAmount', sompiToKaspaString(commitSummary.finalAmount!))
    console.log('[Transaction] estimateKRC20Transaction revealEstimateResult.fees', sompiToKaspaString(revealEstimateResult.fees))
    console.log('[Transaction] estimateKRC20Transaction revealEstimateResult.finalAmount', sompiToKaspaString(revealEstimateResult.finalAmount!))
    
    console.log('[Transaction] estimateKRC20Transaction totalFee', sompiToKaspaString(totalFee))
    console.log('[Transaction] estimateKRC20Transaction totalAmount', sompiToKaspaString(totalAmount))



    return {totalFee: sompiToKaspaString(totalFee), totalAmount: sompiToKaspaString(totalAmount)}
  }

  async getKRC20Info(sender: string, recipient: string, token: Token, amount: string, feeRate: number): Promise<KRC20Info> {

    const { script, scriptAddress } = setupkrc20Transaction(sender, recipient, amount, token)

    return {
      sender,
      recipient,
      feeRate,
      scriptAddress: scriptAddress.toString(),
      script: script.toString(),
    }

  }

  async waitForUTXO(transactionID: string) {
    return new Promise<void>((resolve) => {
      const listener = (event: UtxoProcessorEvent<'maturity'>) => {
        console.log(event)

        if (event.data.id.toString() === transactionID) {
          console.log('event found, continuing')
          // i think the types for the callback are wrong?
          this.processor.removeEventListener('maturity', listener as UtxoProcessorNotificationCallback)
          resolve()
        }
      }
      this.processor.addEventListener('maturity', listener)
    })
  }


  async submitKRC20Commit({scriptAddress, feeRate}: KRC20Info) {
    const commit1 = await this.create([[scriptAddress.toString(), '0.2']], feeRate, '0')
    console.log(commit1)
    // - sign
    console.log('[Transactions] commit transaction sign:')
    const commit2 = await this.sign(commit1)
    console.log(commit2)
    // - submit (gives us the ID)
    console.log('[Transactions] commit transaction submit:')
    const commit3 = await this.submitContextful(commit2)

    return commit3;
  }



  async submitKRC20Reveal(commitId: string, {scriptAddress, sender, script, feeRate}: KRC20Info) {
    const input = {
      address: scriptAddress.toString(),
      outpoint: commitId,
      index: 0,
      signer: sender,
      script: script,
    }

    console.log(input)

    // reveal transaction:
    // - create
    console.log('[Transactions] reveal transaction create:')
    const reveal1 = await this.create([], feeRate, '0.01', [input])
    console.log(reveal1)
    // - sign
    console.log('[Transactions] reveal transaction sign:')
    const reveal2 = await this.sign(reveal1, [input])
    console.log(reveal2)

    // - submit (gives us the ID)
    console.log('[Transactions] reveal transaction submit:')
    const reveal3 = await this.submitContextful(reveal2)
    console.log(reveal3)

    return reveal3
  }


  async writeInscription(recipient: string, token: Token, amount: string, feeRate: number) {

    const ourAddress = this.addresses.receiveAddresses[0]

    const info = await this.getKRC20Info(ourAddress, recipient, token, amount, feeRate)

    const commit = await this.submitKRC20Commit(info)

    const commitId = commit[commit.length - 1]

    await this.waitForUTXO(commitId)

    const reveal = await this.submitKRC20Reveal(commitId, info)

    const revealId = reveal[reveal.length - 1]
    
    return [commitId, revealId]
  }

  reset() {
    delete this.encryptedKey
    delete this.accountId
  }
}
