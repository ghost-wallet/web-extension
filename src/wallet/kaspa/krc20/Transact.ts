import { Address, addressFromScriptPublicKey, ScriptBuilder, XOnlyPublicKey } from '@/wasm/kaspa'
import { Inscription } from './Inscription'
import { TokenFromApi } from '@/utils/interfaces'

export type Token = TokenFromApi

export function setupkrc20Transaction(
  address: string,
  recipient: string,
  amount: string,
  token: TokenFromApi,
  networkId = 'mainnet',
) {
  const script = new ScriptBuilder()
  const inscription = new Inscription('transfer', {
    tick: token.tick,
    amt: BigInt(+amount * 10 ** +token.dec).toString(),
    to: recipient,
  })

  inscription.write(script, XOnlyPublicKey.fromAddress(new Address(address!)).toString())

  const scriptAddress = addressFromScriptPublicKey(script.createPayToScriptHashScript(), networkId!)!

  return { script, scriptAddress }
}

export function setupkrc20Mint(address: string, ticker: string, networkId = 'mainnet') {
  const script = new ScriptBuilder()
  const inscription = new Inscription('mint', {
    tick: ticker,
  })

  inscription.write(script, XOnlyPublicKey.fromAddress(new Address(address!)).toString())

  const scriptAddress = addressFromScriptPublicKey(script.createPayToScriptHashScript(), networkId!)!

  return { script, scriptAddress }
}
