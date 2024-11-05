import { EventEmitter } from 'events'
import {
  Address,
  decryptXChaCha20Poly1305,
  encryptXChaCha20Poly1305,
  Mnemonic,
  PublicKeyGenerator,
  XPrv,
} from '@/wasm'
import LocalStorage from '@/storage/LocalStorage'
import SessionStorage from '@/storage/SessionStorage'
import KeyManager from '@/wallet/kaspa/KeyManager'

export enum Status {
  Uninitialized,
  Locked,
  Unlocked,
}

export default class Wallet extends EventEmitter {
  status: Status = Status.Uninitialized
  encryptedKey?: string

  constructor(readyCallback: () => void) {
    super()

    this.sync()
      .then(() => {
        readyCallback()
      })
      .catch((error) => {
        console.error('[Wallet] Error during sync:', error)
      })

    this.listenSession()
  }

  private async sync() {
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) {
      console.log('[Wallet] No wallet found, setting status to Uninitialized.')
      this.status = Status.Uninitialized
    } else {
      this.encryptedKey = wallet.encryptedKey
      const session = await SessionStorage.get('session', undefined)

      const hasKey = KeyManager.hasKey()
      this.status = session && hasKey ? Status.Unlocked : Status.Locked
      if (this.status === Status.Locked && session) {
        await SessionStorage.remove('session')
      }
      if (this.status === Status.Locked && hasKey) {
        KeyManager.clearKey()
      }
    }

    this.emit('status', this.status)
  }

  async createMnemonic() {
    const mnemonic = Mnemonic.random(12)
    return mnemonic.phrase
  }

  async import(mnemonics: string, password: string) {
    console.log('importing wallet .... ')
    if (!Mnemonic.validate(mnemonics)) {
      console.error('[Wallet] Invalid mnemonic provided.')
      throw Error('[Wallet] Invalid mnemonic')
    }

    const encryptedKey = encryptXChaCha20Poly1305(mnemonics, password)
    this.encryptedKey = encryptedKey
    console.log('set encrypted key...', this.encryptedKey)

    await LocalStorage.set('wallet', {
      encryptedKey: encryptedKey,
    })

    await this.unlock(0, password)
    await this.sync()
  }

  async unlock(id: number, password: string): Promise<string> {
    if (!this.encryptedKey) {
      console.error('[Wallet] No encrypted key available.')
      throw new Error('No encrypted key available.')
    }

    const mnemonic = new Mnemonic(await this.export(password))
    const xPrv = new XPrv(mnemonic.toSeed())
    const publicKey = PublicKeyGenerator.fromMasterXPrv(xPrv, false, BigInt(id))
    const decryptedKey = decryptXChaCha20Poly1305(this.encryptedKey, password)

    KeyManager.setKey(decryptedKey)

    await SessionStorage.set('session', {
      publicKey: publicKey.toString(),
      encryptedKey: this.encryptedKey,
    })
    await this.sync()
    return decryptedKey
  }

  async export(password: string) {
    const wallet = await LocalStorage.get('wallet', undefined)
    if (!wallet) {
      console.error('[Wallet] Error exporting wallet')
      throw Error('Wallet is not initialized')
    }
    return decryptXChaCha20Poly1305(wallet.encryptedKey, password)
  }

  async lock() {
    await SessionStorage.remove('session')
    KeyManager.clearKey()
    await this.sync()
  }

  async reset() {
    await SessionStorage.clear()
    await LocalStorage.remove('wallet')
    await this.sync()
  }

  validate(address: string): boolean {
    console.log('[Wallet] Validating address:', address)
    try {
      return Address.validate(address)
    } catch (error) {
      console.log('[Wallet] Error validating address:', address)
      return false
    }
  }

  private listenSession() {
    SessionStorage.subscribeChanges(async (key, newValue) => {
      if (key !== 'session') return
      if (newValue) {
        console.log('[Wallet] Session active:', newValue)
      } else {
        console.log('[Wallet] Session expired or removed. Locking wallet.')
        await this.sync()
      }
    })
  }
}
