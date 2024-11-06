import browser from 'webextension-polyfill'
import { ISettings } from '@/contexts/settings/SettingsProvider'
import Storage from './Storage'

export interface IWallet {
  encryptedKey: string
  tokens: { [tick: string]: { isHidden: boolean } }
}

export interface ILocalStorage {
  settings: ISettings
  wallet: IWallet | undefined
}

export default new (class LocalStorage extends Storage<ILocalStorage> {
  storage = browser.storage.local
})()
