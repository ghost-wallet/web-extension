import {
  Address,
  createTransactions,
  estimateTransactions,
  kaspaToSompi,
  sompiToKaspaString,
  IGeneratorSettingsObject,
  IUtxoEntry,
  UtxoContext,
  UtxoProcessor,
} from '@/wasm'
import { setupKrc20Mint, setupKrc20Transaction, Token } from './KRC20TransactionSetup'
import {
  KRC20_COMMIT_AMOUNT,
  KRC20_MINT_EXTRA_KAS,
  KRC20_SERVICE_FEE_ADDRESS,
  SOMPI_PER_KAS,
} from '@/utils/constants'
import { KRC20MintEstimateResult, KRC20TokenRequest } from '@/utils/interfaces'
import { calculateScriptExtraFee } from '@/wallet/kaspa/krc20/calculateScriptExtraFee'
import AccountAddresses from '@/wallet/kaspa/account/AccountAddresses'

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

export async function estimateKRC20MintFees(
  addresses: AccountAddresses,
  context: UtxoContext,
  ticker: string,
  feeRate: number,
  timesToMint = 1,
): Promise<KRC20MintEstimateResult> {
  const sender = addresses.receiveAddresses[0]
  const mintSetup = setupKrc20Mint(sender, ticker)
  const scriptAddress = mintSetup.scriptAddress.toString()

  const mintSompi = BigInt(timesToMint) * SOMPI_PER_KAS
  const serviceFee = mintSompi / 10n
  const sompiToLoad = mintSompi + KRC20_MINT_EXTRA_KAS * SOMPI_PER_KAS

  const commitSettings: IGeneratorSettingsObject = {
    priorityEntries: [],
    entries: context,
    outputs: [
      { address: scriptAddress, amount: sompiToLoad },
      { address: KRC20_SERVICE_FEE_ADDRESS, amount: serviceFee },
    ],
    changeAddress: addresses.receiveAddresses[0],
    feeRate,
    priorityFee: 0n,
  }

  const commitResult = await estimateTransactions(commitSettings)
  const totalFeeSompi = mintSompi + serviceFee + commitResult.fees

  return {
    totalFees: sompiToKaspaString(totalFeeSompi),
    mintFees: sompiToKaspaString(mintSompi),
    extraNetworkFees: sompiToKaspaString(commitResult.fees),
    serviceFee: sompiToKaspaString(serviceFee),
    commitTotal: sompiToKaspaString(commitResult.finalAmount!),
  }
}

export async function doKRC20Mint(
  submitKRC20Commit: Function,
  submitKRC20MintReveal: Function,
  waitForUTXO: Function,
  addresses: AccountAddresses,
  processor: UtxoProcessor,
  ticker: string,
  feeRate: number,
  timesToMint = 1,
) {
  console.log('Mint started', `${ticker}. Minting ${timesToMint} time(s).`)

  const sender = addresses.receiveAddresses[0]
  const mintSetup = setupKrc20Mint(sender, ticker)
  const script = mintSetup.script.toString()
  const scriptAddress = mintSetup.scriptAddress.toString()

  const mintSompi = BigInt(timesToMint) * SOMPI_PER_KAS
  const serviceFee = mintSompi / 10n
  const sompiToLoad = mintSompi + KRC20_MINT_EXTRA_KAS * SOMPI_PER_KAS

  const mintContext = new UtxoContext({ processor })
  mintContext.trackAddresses([mintSetup.scriptAddress])

  const commit = await submitKRC20Commit(scriptAddress, feeRate, sompiToKaspaString(sompiToLoad), [
    [KRC20_SERVICE_FEE_ADDRESS, sompiToKaspaString(serviceFee)],
  ])

  const commitId = commit[commit.length - 1]
  await waitForUTXO(commitId)
  let transactionIds = [commitId]

  for (let i = 0; i < timesToMint; i++) {
    console.log('Mint Reveal', `index ${i}`)
    const isLast = i === timesToMint - 1
    const reveal = await submitKRC20MintReveal(
      mintContext,
      transactionIds[i],
      scriptAddress,
      sender,
      script,
      '1',
      !isLast,
    )

    const revealId = reveal[reveal.length - 1]
    await waitForUTXO(revealId)
    transactionIds.push(revealId)
  }

  mintContext.clear()
  console.log('Mint complete', transactionIds)

  return transactionIds
}
