import browser from 'webextension-polyfill'

export default abstract class Storage<IStorage extends Record<string, any> = Record<string, any>> {
  abstract storage: browser.Storage.StorageArea

  async get<key extends keyof IStorage>(
    key: key,
    defaultValue?: IStorage[key],
  ): Promise<IStorage[key] | null> {
    if (typeof key !== 'string') throw new Error('key must be a string')

    try {
      const result = await this.storage.get(key as string)
      if (result[key as string] === undefined) {
        return defaultValue !== undefined ? defaultValue : null
      }
      return JSON.parse(result[key as string])
    } catch (err) {
      console.error(`Error retrieving or parsing key "${key}":`, err)
      return defaultValue !== undefined ? defaultValue : null
    }
  }

  async set<key extends keyof IStorage>(key: key, value: IStorage[key]): Promise<void> {
    await this.storage.set({ [key]: JSON.stringify(value) })
  }

  async remove<key extends keyof IStorage>(key: key): Promise<void> {
    await this.storage.remove(key as string)
  }

  async clear(): Promise<void> {
    await this.storage.clear()
  }

  subscribeChanges<key extends keyof IStorage>(
    callback: (key: key, newValue: IStorage[key] | undefined, oldValue: IStorage[key] | undefined) => void,
  ): void {
    this.storage.onChanged.addListener((changes) => {
      for (const key of Object.keys(changes)) {
        callback(
          key as key,
          changes[key].newValue ? JSON.parse(changes[key].newValue) : undefined,
          changes[key].oldValue ? JSON.parse(changes[key].oldValue) : undefined,
        )
      }
    })
  }
}
