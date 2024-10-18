import { Address, addressFromScriptPublicKey, createTransaction, IGeneratorSettingsObject, PaymentOutput, ScriptBuilder, XOnlyPublicKey } from "@/wasm/kaspa";
import { Inscription } from "./Inscription";
import { Token } from "@/hooks/useKasplex";




export function setupkrc20Transaction(address: string, recipient: string, amount: string, token: Token, networkId = 'MAINNET') {
  //if (!address || recipient === '' || amount === '') return
  //if (!Address.validate(recipient)) return

  const script = new ScriptBuilder()
  const inscription = new Inscription('transfer', {
    tick: token.tick,
    amt: BigInt(+amount * (10 ** +token.dec)).toString(),
    to: recipient.toString()
  })

  inscription.write(script, XOnlyPublicKey.fromAddress(new Address(address!)).toString())

  const scriptAddress = addressFromScriptPublicKey(script.createPayToScriptHashScript(), networkId!)!.toString()

  return {script, scriptAddress}

}
