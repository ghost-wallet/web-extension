import browser from 'webextension-polyfill'
import Storage from './Storage'

export interface ISession {
  publicKey: string
  encryptedKey: string
}

export interface ISessionStorage {
  session: ISession
}

export default new (class SessionStorage extends Storage<ISessionStorage> {
  storage = browser.storage.session
})()
