import {
  Address,
  createInputSignature,
  createTransactions,
  estimateTransactions,
  HexString,
  IGeneratorSettingsObject,
  IScriptPublicKey,
  ITransactionOutpoint,
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
  XPrv
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

function calculateScriptExtraFee(script: HexString, feeRate: number) {
  const scriptBytes = ScriptBuilder.canonicalDataSize(script)
  const scriptExtraFee = BigInt(Math.ceil(scriptBytes * feeRate))
  console.log('scriptBytes', scriptBytes)
  console.log('scriptExtraFee', scriptExtraFee)
  console.log('scriptExtraFee kaspa', sompiToKaspaString(scriptExtraFee))
  return scriptExtraFee
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

  async estimateKaspaTransactionFee(outputs: [string, string][], feeRate: number, fee: string) {
    const preparedTxn = {
      entries: this.context,
      outputs: outputs.map((output) => ({
        address: output[0],
        amount: kaspaToSompi(output[1])!,
      })),
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: kaspaToSompi(fee)!,
    }

    const estimate = await estimateTransactions(preparedTxn)
    console.log('estimated kaspa fee:', estimate.fees)

    return sompiToKaspaString(estimate.fees)
  }

  async create(
    outputs: [string, string][],
    feeRate: number,
    fee: string,
    customs?: CustomInput[],
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
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: kaspaToSompi(fee)!,
    }
    console.log('Creating transaction with:')
    console.log(preparedTxn)

    const { transactions, summary } = await createTransactions(preparedTxn)

    // TODO: Move this to later?
    //await this.addresses.increment(0, 1)

    for (const transaction of transactions) {
      this.transactions.set(transaction.id, transaction)
    }

    const transactionStrings = transactions.map((transaction) => transaction.serializeToSafeJSON())
    return [transactionStrings, sompiToKaspaString(summary.fees)]
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

  async submitKaspaTransaction(transactions: string[], customs: CustomSignature[] = []) {
    const signed = await this.sign(transactions, customs)
    const transactionIds = await this.submitContextful(signed)
    await this.addresses.increment(0, 1)
    return transactionIds
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

  async estimateKRC20TransactionFee(info: KRC20Info, feeRate: number) {
    const { scriptAddress, script } = info

    //const commit1 = await this.create([[scriptAddress, '0.2']], feeRate, '0')

    const commitSettings: IGeneratorSettingsObject = {
      priorityEntries: [],
      entries: this.context,
      outputs: [
        {
          address: scriptAddress,
          amount: kaspaToSompi('0.2')!,
        },
      ],
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
      index: 0,
    }

    const commitUTXO: IUtxoEntry = {
      address: new Address(scriptAddress),
      outpoint: commitOutpoint,
      amount: commitOutput.value,
      scriptPublicKey: commitOutput.scriptPublicKey as IScriptPublicKey, // hopefully this works
      blockDaaScore: BigInt(0),
      isCoinbase: false,
    }

    const scriptExtraFee = calculateScriptExtraFee(script, feeRate)

    const revealSettings: IGeneratorSettingsObject = {
      priorityEntries: [commitUTXO],
      entries: this.context,
      outputs: [],
      changeAddress: this.addresses.changeAddresses[this.addresses.changeAddresses.length - 1],
      feeRate,
      priorityFee: scriptExtraFee,
    }

    console.log('[Transaction] estimateKRC20Transaction revealSettings: ', revealSettings)

    const revealEstimateResult = await estimateTransactions(revealSettings)

    console.log('[Transaction] estimateKRC20Transaction revealEstimateResult: ', revealEstimateResult)

    const totalFee = commitSummary.fees + revealEstimateResult.fees
    const totalAmount = commitSummary.finalAmount! + revealEstimateResult.finalAmount!

    console.log(
      '[Transaction] estimateKRC20Transaction commitSummary.fees',
      sompiToKaspaString(commitSummary.fees),
    )
    console.log(
      '[Transaction] estimateKRC20Transaction commitSummary.finalAmount',
      sompiToKaspaString(commitSummary.finalAmount!),
    )
    console.log(
      '[Transaction] estimateKRC20Transaction revealEstimateResult.fees',
      sompiToKaspaString(revealEstimateResult.fees),
    )
    console.log(
      '[Transaction] estimateKRC20Transaction revealEstimateResult.finalAmount',
      sompiToKaspaString(revealEstimateResult.finalAmount!),
    )

    console.log('[Transaction] estimateKRC20Transaction totalFee', sompiToKaspaString(totalFee))
    console.log('[Transaction] estimateKRC20Transaction totalAmount', sompiToKaspaString(totalAmount))

    return sompiToKaspaString(totalFee)
  }

  async getKRC20Info(recipient: string, token: Token, amount: string): Promise<KRC20Info> {
    const sender = this.addresses.receiveAddresses[0]
    const { script, scriptAddress } = setupkrc20Transaction(sender, recipient, amount, token)
    return {
      sender,
      recipient,
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

  async submitKRC20Commit({ scriptAddress }: KRC20Info, feeRate: number) {
    const [commit1] = await this.create([[scriptAddress.toString(), '0.2']], feeRate, '0')
    console.log('[Transactions] Created commit transaction:', commit1)

    // - sign
    const commit2 = await this.sign(commit1)
    console.log('[Transactions] Signed commit transaction:', commit2)

    // - submit (gives us the ID)
    const commit3 = await this.submitContextful(commit2)
    console.log('[Transactions] Submitted commit transaction:', commit3)
    return commit3
  }

  async submitKRC20Reveal(commitId: string, { scriptAddress, sender, script }: KRC20Info, feeRate: number) {
    // - prepare the reveal txn input
    const input = {
      address: scriptAddress.toString(),
      outpoint: commitId,
      index: 0,
      signer: sender,
      script: script,
    }
    console.log('[Transactions] Reveal transaction input:', input)

    const scriptExtraFee = calculateScriptExtraFee(script, feeRate)

    // - create
    const [reveal1] = await this.create([], feeRate, sompiToKaspaString(scriptExtraFee), [input])
    console.log('[Transactions] Created reveal transaction:', reveal1)

    // - sign
    const reveal2 = await this.sign(reveal1, [input])
    console.log('[Transactions] Signed reveal transaction:', reveal2)

    // - submit (gives us the ID)
    const reveal3 = await this.submitContextful(reveal2)
    console.log('[Transactions] Submitted reveal transaction:', reveal3)

    return reveal3
  }

  async submitKRC20Transaction(info: KRC20Info, feeRate: number) {
    const commit = await this.submitKRC20Commit(info, feeRate)

    const commitId = commit[commit.length - 1]

    await this.waitForUTXO(commitId)

    const reveal = await this.submitKRC20Reveal(commitId, info, feeRate)

    const revealId = reveal[reveal.length - 1]

    await this.addresses.increment(0, 1)

    return [commitId, revealId]
  }

  reset() {
    delete this.encryptedKey
    delete this.accountId
  }
}
