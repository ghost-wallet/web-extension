import { HexString, ScriptBuilder } from '@/wasm'

export function calculateScriptExtraFee(script: HexString, feeRate: number) {
  const scriptBytes = ScriptBuilder.canonicalDataSize(script)
  return BigInt(Math.ceil((scriptBytes + 1) * feeRate))
}
