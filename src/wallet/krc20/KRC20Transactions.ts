import {
  Address,
  addressFromScriptPublicKey,
  createTransactions,
  estimateTransactions,
  HexString,
  IGeneratorSettingsObject,
  IUtxoEntry,
  kaspaToSompi,
  RpcClient,
  ScriptBuilder,
  sompiToKaspaString,
  UtxoContext,
  UtxoProcessor,
  UtxoProcessorEvent,
  UtxoProcessorNotificationCallback,
  XOnlyPublicKey,
} from '@/wasm/kaspa'
import EventEmitter from 'events'
import AccountAddresses from '../account/AccountAddresses'
import AccountTransactions from '../account/AccountTransactions'
import { KRC20TokenRequest, TokenFromApi } from '@/utils/interfaces'
import { KRC20Inscription } from './KRC20Inscription'
import { KRC20_COMMIT_AMOUNT } from '@/utils/constants/constants'

export type Token = TokenFromApi

function setupKrc20Transaction(
  address: string,
  recipient: string,
  amount: string,
  tick: string,
  dec: string | number,
  networkId = 'mainnet',
) {
  const script = new ScriptBuilder()
  const inscription = new KRC20Inscription('transfer', {
    tick,
    amt: BigInt(+amount * 10 ** +dec).toString(),
    to: recipient,
  })

  inscription.write(script, XOnlyPublicKey.fromAddress(new Address(address!)).toString())

  const scriptAddress = addressFromScriptPublicKey(script.createPayToScriptHashScript(), networkId!)!

  return { script, scriptAddress }
}

function calculateScriptExtraFee(script: HexString, feeRate: number) {
  const scriptBytes = ScriptBuilder.canonicalDataSize(script)
  return BigInt(Math.ceil((scriptBytes + 1) * feeRate))
}

export default class KRC20Transactions extends EventEmitter {
  constructor(
    private kaspa: RpcClient,
    private context: UtxoContext,
    private processor: UtxoProcessor,
    private addresses: AccountAddresses,
    private transactions: AccountTransactions,
  ) {
    super()
  }

  async estimateKRC20TransactionFee(info: KRC20TokenRequest, feeRate: number): Promise<string> {
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

    const scriptExtraFee = calculateScriptExtraFee(script, feeRate)

    const revealSettings: IGeneratorSettingsObject = {
      priorityEntries: [
        {
          address: new Address(scriptAddress),
          outpoint: { transactionId: commitTxn.id, index: 0 },
          amount: commitTxn.transaction.outputs[0].value,
          scriptPublicKey: commitTxn.transaction.outputs[0].scriptPublicKey,
          blockDaaScore: BigInt(0),
          isCoinbase: false,
        } as IUtxoEntry,
      ],
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

  async getKRC20Info(
    recipient: string,
    { tick, dec }: { tick: string; dec: number | string },
    amount: string,
  ): Promise<KRC20TokenRequest> {
    const sender = this.addresses.receiveAddresses[0]
    const { script, scriptAddress } = setupKrc20Transaction(sender, recipient, amount, tick, dec)
    return {
      sender,
      recipient,
      scriptAddress: scriptAddress.toString(),
      script: script.toString(),
    }
  }

  async submitKRC20Commit(
    scriptAddress: string,
    feeRate: number,
    amount: string = KRC20_COMMIT_AMOUNT,
    additionalOutputs: [string, string][] = [],
  ) {
    const [commit1] = await this.transactions.create(
      [[scriptAddress, amount], ...additionalOutputs],
      feeRate,
      '0',
    )
    const commit2 = await this.transactions.sign(commit1)
    return await this.transactions.submitContextful(commit2)
  }

  async submitKRC20Reveal(commitId: string, info: KRC20TokenRequest, feeRate: number) {
    const input = {
      address: info.scriptAddress,
      outpoint: commitId,
      index: 0,
      signer: info.sender,
      script: info.script,
    }

    const scriptExtraFee = calculateScriptExtraFee(info.script, feeRate)

    const [reveal1] = await this.transactions.create([], feeRate, sompiToKaspaString(scriptExtraFee), [input])
    const reveal2 = await this.transactions.sign(reveal1, [input])
    return await this.transactions.submitContextful(reveal2)
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
}
