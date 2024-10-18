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
  IUtxosChanged,
  UtxoProcessor,
  IMaturityEvent,
  UtxoProcessorNotificationCallback,
  UtxoProcessorEvent
} from '@/wasm'
import Addresses from './addresses'
import EventEmitter from 'events'
import KeyManager from '@/wallet/kaspa/KeyManager'
import Account from '@/wallet/kaspa/account/account'
import { Token } from '@/hooks/useKasplex'
import { setupkrc20Transaction } from '../krc20/Transact'

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

  async create(outputs: [string, string][], feeRate: number, fee: string, customs?: CustomInput[]) {
    let priorityEntries: IUtxoEntry[] = []

    if (customs && customs.length > 0) {
      console.log('customs:')
      console.log(customs)
      const { entries } = await this.kaspa.getUtxosByAddresses({
        addresses: customs.map((custom) => custom.address),
      })
      console.log('entries:')
      console.log(entries)
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
    console.log('[Transactions] create - doing createTransasctions with obj:', preparedTxn)
    console.log('[Transactions] this.context:', this.context)

    const { transactions } = await createTransactions(preparedTxn)

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
        const inputIndex = signedTransaction.inputs.findIndex(({ previousOutpoint }) => previousOutpoint.transactionId === custom.outpoint && previousOutpoint.index === custom.index)

        if (Address.validate(custom.signer)) {
          if (!custom.script) throw Error('Script is required when signer address is supplied')

          const [ isReceive, index ] = this.addresses.findIndexes(custom.signer)
          const privateKey = isReceive ? keyGenerator.receiveKey(index) : keyGenerator.changeKey(index)

          signedTransaction.inputs[inputIndex].signatureScript = ScriptBuilder.fromScript(custom.script).encodePayToScriptHashSignatureScript(createInputSignature(signedTransaction, inputIndex, privateKey))
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

  async writeInscription(recipient: string, token: Token, amount: string, feeRate: number) {
    console.log(`fee rate: ${feeRate}`)

    console.log('[Transactions] Writing inscription....')

    const ourAddress = this.addresses.receiveAddresses[0]

    const {script, scriptAddress} = setupkrc20Transaction(ourAddress, recipient, amount, token)

    // commit transaction:
    // - create
    console.log('[Transactions] commit transaction create:')
    const commit1 = await this.create([[ scriptAddress, '0.2' ]], feeRate, '0')
    console.log(commit1)
    // - sign
    console.log('[Transactions] commit transaction sign:')
    const commit2 = await this.sign(commit1)
    console.log(commit2)
    // - submit (gives us the ID)
    console.log('[Transactions] commit transaction submit:')
    const commit3 = await this.submitContextful(commit2)
    console.log(commit3)

    //console.log('waiting...')
    //await new Promise(resolve => setTimeout(resolve, 5000))
    //this.kaspa.
    //onsole.log('done waiting!')

    console.log('waiting for event')
    await new Promise<void>((resolve) => {
      const listener = (event: UtxoProcessorEvent<'maturity'>) => {
        console.log(event)

        if (event.data.id.toString() === commit3[0]) {
          console.log('event found, continuing')
          // i think the types for the callback are wrong?
          this.processor.removeEventListener('maturity', listener as UtxoProcessorNotificationCallback);
          resolve()
        }
      }
      this.processor.addEventListener('maturity', listener)
    })

    const input = {
      address: scriptAddress!,
      outpoint: commit3[0],
      index: 0,
      signer: ourAddress!,
      script: script.toString()
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


    // TODO: make the inscription, make a create transaction, submit a reveal txn

    return [commit3[0], reveal3[0]]
  }

  reset() {
    delete this.encryptedKey
    delete this.accountId
  }
}
