import { Address, addressFromScriptPublicKey, ScriptBuilder, XOnlyPublicKey } from '@/wasm/kaspa'
import { Inscription } from './Inscription'
import { Token } from '@/contexts/kasplex/kasplexReducer'

export function setupkrc20Transaction(
  address: string,
  recipient: string,
  amount: string,
  token: Token,
  networkId = 'MAINNET',
) {
  const script = new ScriptBuilder()
  const inscription = new Inscription('transfer', {
    tick: token.tick,
    amt: BigInt(+amount * 10 ** +token.dec).toString(),
    to: recipient.toString(),
  })

  inscription.write(script, XOnlyPublicKey.fromAddress(new Address(address!)).toString())

  const scriptAddress = addressFromScriptPublicKey(
    script.createPayToScriptHashScript(),
    networkId!,
  )!

  return { script, scriptAddress }
}


