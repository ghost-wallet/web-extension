import { Address, addressFromScriptPublicKey, ScriptBuilder, XOnlyPublicKey } from '@/wasm'
import { KRC20Inscription } from './KRC20Inscription'
import { TokenFromApi } from '@/utils/interfaces'

export type Token = TokenFromApi

export function setupKrc20Transaction(
  address: string,
  recipient: string,
  amount: string,
  token: TokenFromApi,
  networkId = 'mainnet',
) {
  const script = new ScriptBuilder()
  const inscription = new KRC20Inscription('transfer', {
    tick: token.tick,
    amt: BigInt(+amount * 10 ** +token.dec).toString(),
    to: recipient,
  })

  inscription.write(script, XOnlyPublicKey.fromAddress(new Address(address!)).toString())

  const scriptAddress = addressFromScriptPublicKey(script.createPayToScriptHashScript(), networkId!)!

  return { script, scriptAddress }
}
