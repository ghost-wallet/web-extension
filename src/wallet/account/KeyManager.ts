import { Mnemonic, PrivateKey, PrivateKeyGenerator, Transaction, XPrv } from '@/wasm'
import AccountAddresses from '@/wallet/account/AccountAddresses'

export default new (class KeyManager {
  private decryptedKey: string | null = null

  setKey(decryptedKey: string) {
    this.decryptedKey = decryptedKey
  }

  hasKey(): boolean {
    return !!this.decryptedKey
  }

  clearKey() {
    this.decryptedKey = null
  }

  getDecryptedKey(): string {
    if (!this.decryptedKey) {
      throw new Error('[AccountTransactions] Error: no decrypted key found')
    }
    return this.decryptedKey
  }

  createKeyGenerator(): PrivateKeyGenerator {
    const mnemonic = new Mnemonic(this.getDecryptedKey())
    const seed = mnemonic.toSeed()
    const xprv = new XPrv(seed)
    return new PrivateKeyGenerator(xprv, false, 0n)
  }
})()
