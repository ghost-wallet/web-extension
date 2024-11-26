import browser from 'webextension-polyfill'
import { ISettings } from '@/contexts/settings/SettingsProvider'
import Storage from './Storage'

export interface IWallet {
  encryptedKey: string
  tokens: { [tick: string]: { isHidden: boolean } }
  accounts: IAccount[]
}

export interface IAccount {
  accountName: string
}

export interface ILocalStorage {
  settings: ISettings
  wallet: IWallet
}

export default new (class LocalStorage extends Storage<ILocalStorage> {
  storage = browser.storage.local
})()
