export default new (class KeyManager {
  private decryptedKey: string | null = null

  setKey(decryptedKey: string) {
    this.decryptedKey = decryptedKey
  }

  getKey(): string {
    if (!this.decryptedKey) {
      throw new Error('No decrypted key available. Please log in again.')
    }
    return this.decryptedKey
  }

  clearKey() {
    this.decryptedKey = null
  }
})()
