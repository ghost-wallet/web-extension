import {
  Address,
  createTransactions,
  estimateTransactions,
  kaspaToSompi,
  sompiToKaspaString,
  IGeneratorSettingsObject,
  IUtxoEntry,
  UtxoContext,
} from '@/wasm'
import { setupKrc20Transaction, Token } from './KRC20TransactionSetup'
import { KRC20_COMMIT_AMOUNT } from '@/utils/constants/constants'
import { KRC20TokenRequest } from '@/utils/interfaces'
import { calculateScriptExtraFee } from '@/wallet/krc20/calculateScriptExtraFee'
import AccountAddresses from '@/wallet/account/AccountAddresses'

export async function estimateKRC20TransactionFee(
  context: UtxoContext,
  addresses: AccountAddresses,
  info: KRC20TokenRequest,
  feeRate: number,
): Promise<string> {
  const { scriptAddress, script } = info

  const commitSettings: IGeneratorSettingsObject = {
    priorityEntries: [],
    entries: context,
    outputs: [
      {
        address: scriptAddress,
        amount: kaspaToSompi(KRC20_COMMIT_AMOUNT)!,
      },
    ],
    changeAddress: addresses.receiveAddresses[0],
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
    entries: context,
    outputs: [],
    changeAddress: addresses.receiveAddresses[0],
    feeRate,
    priorityFee: scriptExtraFee,
  }

  const revealEstimateResult = await estimateTransactions(revealSettings)
  const totalFee = commitSummary.fees + revealEstimateResult.fees

  return sompiToKaspaString(totalFee)
}

export async function getKRC20Info(
  addresses: AccountAddresses,
  recipient: string,
  token: Token,
  amount: string,
): Promise<KRC20TokenRequest> {
  const sender = addresses.receiveAddresses[0]
  const { script, scriptAddress } = setupKrc20Transaction(sender, recipient, amount, token)
  return {
    sender,
    recipient,
    scriptAddress: scriptAddress.toString(),
    script: script.toString(),
  }
}

export async function submitKRC20Commit(
  create: Function,
  sign: Function,
  submitContextful: Function,
  scriptAddress: string,
  feeRate: number,
  amount: string = KRC20_COMMIT_AMOUNT,
  additionalOutputs: [string, string][] = [],
) {
  const [commit1] = await create([[scriptAddress, amount], ...additionalOutputs], feeRate, '0')
  const commit2 = await sign(commit1)
  return await submitContextful(commit2)
}

export async function submitKRC20Reveal(
  create: Function,
  sign: Function,
  submitContextful: Function,
  commitId: string,
  context: UtxoContext,
  info: KRC20TokenRequest,
  feeRate: number,
) {
  const input = {
    address: info.scriptAddress,
    outpoint: commitId,
    index: 0,
    signer: info.sender,
    script: info.script,
  }

  const scriptExtraFee = calculateScriptExtraFee(info.script, feeRate)

  const [reveal1] = await create([], feeRate, sompiToKaspaString(scriptExtraFee), [input])
  const reveal2 = await sign(reveal1, [input])
  return await submitContextful(reveal2)
}
