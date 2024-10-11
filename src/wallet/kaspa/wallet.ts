import { EventEmitter } from 'events'
import {
  Mnemonic,
  encryptXChaCha20Poly1305,
  decryptXChaCha20Poly1305,
  XPrv,
  PublicKeyGenerator,
  Address, // Import the Address module from wasm
} from '@/wasm'
import LocalStorage from '@/storage/LocalStorage'
import SessionStorage from '@/storage/SessionStorage'

export enum Status {
  Uninitialized,
  Locked,
  Unlocked,
}

export default class Wallet extends EventEmitter {
  status: Status = Status.Uninitialized

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
  }

  private async sync() {
    console.log('wallet.ts: Syncing wallet state...')
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) {
      console.log('wallet.ts: No wallet found, setting status to Uninitialized.')
      this.status = Status.Uninitialized
    } else {
      const session = await SessionStorage.get('session', undefined)

      console.log('wallet.ts: Session data retrieved:', session)
      this.status = session ? Status.Unlocked : Status.Locked
    }

    console.log('wallet.ts: Emitting status update:', this.status)
    this.emit('status', this.status)
  }

  async create(password: string) {
    console.log('wallet.ts: Creating new wallet...')
    const mnemonic = Mnemonic.random(24)
    await this.import(mnemonic.phrase, password)

    console.log('wallet.ts: Wallet created with mnemonic phrase.')
    return mnemonic.phrase
  }

  async import(mnemonics: string, password: string) {
    console.log('wallet.ts: Importing wallet...')
    if (!Mnemonic.validate(mnemonics)) {
      console.error('wallet.ts: Invalid mnemonic provided.')
      throw Error('Invalid mnemonic')
    }

    await LocalStorage.set('wallet', {
      encryptedKey: encryptXChaCha20Poly1305(mnemonics, password),
      accounts: [
        {
          name: 'Wallet',
          receiveCount: 1,
          changeCount: 1,
        },
      ],
    })

    console.log('wallet.ts: Wallet imported and stored. Unlocking...')
    await this.unlock(0, password)
    await this.sync()
  }

  async unlock(id: number, password: string) {
    console.log(`wallet.ts: Unlocking wallet for account ID ${id}...`)
    const mnemonic = new Mnemonic(await this.export(password))
    const extendedKey = new XPrv(mnemonic.toSeed())

    console.log('wallet.ts: Derived extended key, generating public key...')
    const publicKey = await PublicKeyGenerator.fromMasterXPrv(extendedKey, false, BigInt(id))
    console.log('wallet.ts: Public key generated:', publicKey.toString())

    await SessionStorage.set('session', {
      activeAccount: id,
      publicKey: publicKey.toString(),
      encryptedKey: encryptXChaCha20Poly1305(extendedKey.toString(), password),
    })

    console.log('wallet.ts: Wallet unlocked and session stored.')
    await this.sync()
  }

  async export(password: string) {
    console.log('wallet.ts: Exporting wallet...')
    const wallet = await LocalStorage.get('wallet', undefined)

    if (!wallet) {
      console.error('wallet.ts: Wallet not initialized.')
      throw Error('Wallet is not initialized')
    }

    return decryptXChaCha20Poly1305(wallet.encryptedKey, password)
  }

  async lock() {
    console.log('wallet.ts: Locking wallet...')
    await SessionStorage.remove('session')
    await this.sync()
    console.log('wallet.ts: Wallet locked.')
  }

  async reset() {
    console.log('wallet.ts: Resetting wallet...')
    await SessionStorage.clear()
    await LocalStorage.remove('wallet')
    await this.sync()
    console.log('wallet.ts: Wallet reset completed.')
  }

  // New method to validate an address
  validate(address: string): boolean {
    console.log('wallet.ts: Validating address:', address)
    try {
      const isValid = Address.validate(address)
      console.log('wallet.ts: Address validation result:', isValid)
      return isValid
    } catch (error) {
      console.error('wallet.ts: Error validating address:', error)
      return false
    }
  }
}
