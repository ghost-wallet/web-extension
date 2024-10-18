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
  encryptedKey?: string // Define encryptedKey as a property

  constructor(readyCallback: () => void) {
    super()
    console.log('[Wallet] Wallet constructor called.')

    this.sync()
      .then(() => {
        console.log('[Wallet] Sync complete. Calling ready callback.')
        readyCallback()
      })
      .catch((error) => {
        console.error('[Wallet] Error during sync:', error)
      })

    this.listenSession()
  }

  private async sync() {
    console.log('[Wallet] Syncing wallet state...')
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) {
      console.log('[Wallet] No wallet found, setting status to Uninitialized.')
      this.status = Status.Uninitialized
    } else {
      this.encryptedKey = wallet.encryptedKey // Set the encryptedKey from the stored wallet
      const session = await SessionStorage.get('session', undefined)

      console.log('[Wallet] Session data retrieved:', session)
      this.status = session ? Status.Unlocked : Status.Locked
    }

    console.log('[Wallet] Emitting status update:', this.status)
    this.emit('status', this.status)
  }

  async create(password: string) {
    //TODO remove password
    console.log('[Wallet] Creating new wallet...')
    const mnemonic = Mnemonic.random(12)

    console.log('[Wallet] Wallet created with mnemonic phrase.', mnemonic.phrase)
    return mnemonic.phrase
  }

  async import(mnemonics: string, password: string) {
    console.log('[Wallet] Importing wallet...')
    if (!Mnemonic.validate(mnemonics)) {
      console.error('[Wallet] Invalid mnemonic provided.')
      throw Error('[Wallet] Invalid mnemonic')
    }

    // TODO: Keyemanager setkey to decryptedKey, because potential issue is this:
    // TODO: User imports/creates new wallet, but they will not be authorized to transfer any cryptos
    // TODO: because their decrypted key is not stored. Replicate

    const encryptedKey = encryptXChaCha20Poly1305(mnemonics, password)
    this.encryptedKey = encryptedKey // Set the encryptedKey

    await LocalStorage.set('wallet', {
      encryptedKey: encryptedKey,
      accounts: [
        {
          name: 'Wallet',
          receiveCount: 1,
          changeCount: 1,
        },
      ],
    })

    console.log('[Wallet] Wallet imported and stored. Unlocking...')
    await this.unlock(0, password)
    await this.sync()
  }

  async unlock(id: number, password: string): Promise<string> {
    console.log(`[Wallet] Unlocking wallet for account ID ${id}...`)
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
      activeAccount: id,
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
    KeyManager.clearKey() // Clear the decrypted key from memory
    await this.sync()
  }

  async reset() {
    console.log('[Wallet] Wallet hard reset... status:', this.status)
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
