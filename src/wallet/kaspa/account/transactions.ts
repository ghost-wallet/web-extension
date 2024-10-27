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
  XPrv,
} from '@/wasm'
import Addresses from './addresses'
import EventEmitter from 'events'
import KeyManager from '@/wallet/kaspa/KeyManager'
import Account from '@/wallet/kaspa/account/account'
import { setupkrc20Mint, setupkrc20Transaction, Token } from '../krc20/Transact'
import { CustomInput, CustomSignature, KRC20MintEstimateResult, KRC20TokenRequest } from '@/utils/interfaces'
import { KRC20_COMMIT_AMOUNT, KRC20_MINT_EXTRA_KAS, SOMPI_PER_KAS } from '@/utils/constants'
import { createNotification } from '@/utils/notifications'


function calculateScriptExtraFee(script: HexString, feeRate: number) {
  const scriptBytes = ScriptBuilder.canonicalDataSize(script)
  return BigInt(Math.ceil((scriptBytes + 1) * feeRate))
}

export default class Transactions extends EventEmitter {
  kaspa: RpcClient
  context: UtxoContext
  processor: UtxoProcessor
  addresses: Addresses
  account: Account | null = null
  encryptedKey: string | undefined

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

  async import(encryptedKey: string) {
    this.encryptedKey = encryptedKey
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
    console.log('Creating transaction with:')
    console.log(preparedTxn)

    const { transactions, summary } = await createTransactions(preparedTxn)

    console.log('create transactions', transactions)
    console.log('create summary', summary)

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

  async estimateKRC20TransactionFee(info: KRC20TokenRequest, feeRate: number) {
    const { scriptAddress, script } = info

    const commitSettings: IGeneratorSettingsObject = {
      priorityEntries: [],
      entries: this.context,
      outputs: [
        {
          address: scriptAddress,
          amount: kaspaToSompi(KRC20_COMMIT_AMOUNT)!,
        },
      ],
      changeAddress: this.addresses.receiveAddresses[0],
      feeRate,
      priorityFee: kaspaToSompi('0')!,
    }

    const commitResult = await createTransactions(commitSettings)
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
      changeAddress: this.addresses.receiveAddresses[0],
      feeRate,
      priorityFee: scriptExtraFee,
    }

    const revealEstimateResult = await estimateTransactions(revealSettings)
    const totalFee = commitSummary.fees + revealEstimateResult.fees

    return sompiToKaspaString(totalFee)
  }

  async getKRC20Info(recipient: string, token: Token, amount: string): Promise<KRC20TokenRequest> {
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

  async submitKRC20Commit(scriptAddress: string, feeRate: number, amount: string = KRC20_COMMIT_AMOUNT) {
    const [commit1] = await this.create([[scriptAddress, amount]], feeRate, '0')
    console.log('[Transactions] Created commit transaction:', commit1)

    const commit2 = await this.sign(commit1)
    console.log('[Transactions] Signed commit transaction:', commit2)

    const commit3 = await this.submitContextful(commit2)
    console.log('[Transactions] Submitted commit transaction:', commit3)
    return commit3
  }

  async submitKRC20Reveal(
    commitId: string,
    { scriptAddress, sender, script }: KRC20TokenRequest,
    feeRate: number,
  ) {
    const input = {
      address: scriptAddress.toString(),
      outpoint: commitId,
      index: 0,
      signer: sender,
      script: script,
    }
    console.log('[Transactions] Reveal transaction input:', input)

    const scriptExtraFee = calculateScriptExtraFee(script, feeRate)

    const [reveal1] = await this.create([], feeRate, sompiToKaspaString(scriptExtraFee), [input])
    console.log('[Transactions] Created reveal transaction:', reveal1)

    const reveal2 = await this.sign(reveal1, [input])
    console.log('[Transactions] Signed reveal transaction:', reveal2)

    const reveal3 = await this.submitContextful(reveal2)
    console.log('[Transactions] Submitted reveal transaction:', reveal3)
    return reveal3
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

  //TODO remove optional changeAddress. Always use receive address for change
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

    const preparedTxn = {
      priorityEntries,
      entries: context,
      outputs: [],
      changeAddress: changeAddress ?? this.addresses.receiveAddresses[0],
      priorityFee: kaspaToSompi(fee)!,
    }
    console.log('Creating transaction with:')
    console.log(preparedTxn)

    const { transactions, summary } = await createTransactions(preparedTxn)

    console.log('create transactions', transactions)
    console.log('create summary', summary)

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
    // - prepare the reveal txn input
    const input = {
      address: scriptAddress,
      outpoint: commitId,
      index: 0,
      signer: sender,
      script: script,
    }
    console.log('[Transactions] Reveal transaction input:', input)

    const [reveal1] = await this.createForKRC20Mint(
      context,
      fee,
      [input],
      backToScript ? scriptAddress : undefined,
    )
    console.log('[Transactions] Created reveal transaction:', reveal1)

    const reveal2 = await this.sign(reveal1, [input])
    console.log('[Transactions] Signed reveal transaction:', reveal2)

    const reveal3 = await this.submitContextful(reveal2)
    console.log('[Transactions] Submitted reveal transaction:', reveal3)
    return reveal3
  }

  async estimateKRC20MintFees(ticker: string, feeRate: number, timesToMint: number): Promise<KRC20MintEstimateResult> {
    const sender = this.addresses.receiveAddresses[0]
    const mintSetup = setupkrc20Mint(sender, ticker)
    const scriptAddress = mintSetup.scriptAddress.toString()

    const mintSompi = BigInt(timesToMint) * SOMPI_PER_KAS
    const sompiToLoad = mintSompi + (KRC20_MINT_EXTRA_KAS * SOMPI_PER_KAS)

    //const kaspaToLoad = (timesToMint + 10).toString()

    const commitSettings: IGeneratorSettingsObject = {
      priorityEntries: [],
      entries: this.context,
      outputs: [
        {
          address: scriptAddress,
          amount: sompiToLoad!,
        },
      ],
      changeAddress: this.addresses.receiveAddresses[0],
      feeRate,
      priorityFee: 0n!,
    }

    const commitResult = await estimateTransactions(commitSettings)

    const serviceFee = mintSompi / 10n

    const totalFeeSompi = mintSompi + serviceFee + commitResult.fees
    console.log('commitResult.fees', commitResult.fees)

    return {
      totalFees: sompiToKaspaString(totalFeeSompi),
      mintFees: sompiToKaspaString(mintSompi),
      extraNetworkFees: sompiToKaspaString(commitResult.fees),
      serviceFee: sompiToKaspaString(serviceFee),
      commitTotal: sompiToKaspaString(commitResult.finalAmount!)
    }
  }

  async doKRC20Mint(ticker: string, feeRate: number, timesToMint = 1) {
    console.log(`[Transactions] Mint started for ${ticker}. Minting ${timesToMint} time(s).`)

    const sender = this.addresses.receiveAddresses[0]
    const mintSetup = setupkrc20Mint(sender, ticker)
    const script = mintSetup.script.toString()
    const scriptAddress = mintSetup.scriptAddress.toString()
    const kaspaToLoad = (timesToMint + 10).toString()

    const mintContext = new UtxoContext({ processor: this.processor })
    mintContext.trackAddresses([mintSetup.scriptAddress])

    const commit = await this.submitKRC20Commit(scriptAddress, feeRate, kaspaToLoad)

    const commitId = commit[commit.length - 1]

    await this.waitForUTXO(commitId)

    let transactionIds = [commitId]

    for (let i = 0; i < timesToMint; i++) {
      console.log(`[Transactions] Mint Reveal index ${i}`)
      const isLast = i === timesToMint - 1
      const reveal = await this.submitKRC20MintReveal(
        mintContext,
        transactionIds[i],
        scriptAddress,
        sender,
        script,
        '1',
        !isLast,
      )

      const revealId = reveal[reveal.length - 1]

      await this.waitForUTXO(revealId)

      transactionIds.push(revealId)
    }

    mintContext.clear()

    console.log('[Transactions] Mint complete', transactionIds)

    createNotification('Mint Completed', `Done minting ${timesToMint} ${ticker}`)

    return transactionIds
  }

  reset() {
    delete this.encryptedKey
  }
}
