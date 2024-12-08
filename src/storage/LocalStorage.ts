import browser from 'webextension-polyfill'
import { ISettings } from '@/contexts/settings/SettingsProvider'
import Storage from './Storage'

export interface IWallet {
  encryptedKey: string
  tokens: { [tick: string]: { isHidden: boolean } }
  accountName: string
}

interface IAccount {
  name: string
  receiveCount: number
  changeCount: number
  tokens: { [tick: string]: { isHidden: boolean } }
}

export interface IWalletV2 {
  encryptedKey: string
  accounts: IAccount[]
}

export interface ILocalStorage {
  settings: ISettings
  wallet: IWallet
  walletV2: IWalletV2
}

export default new (class LocalStorage extends Storage<ILocalStorage> {
  storage = browser.storage.local
})()
