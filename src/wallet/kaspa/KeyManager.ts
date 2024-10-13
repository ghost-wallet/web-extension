// KeyManager.ts
export default new (class KeyManager {
  private decryptedKey: string | null = null

  // Store the decrypted key in memory
  setKey(decryptedKey: string) {
    console.log('[KeyManager] Setting key', this.decryptedKey)
    this.decryptedKey = decryptedKey
  }

  // Retrieve the decrypted key from memory
  getKey(): string {
    console.log('[KeyManager] Getting key', this.decryptedKey)
    if (!this.decryptedKey) {
      throw new Error('No decrypted key available. Please log in again.')
    }
    return this.decryptedKey
  }

  // Clear the key from memory (e.g., on logout or session expiration)
  clearKey() {
    this.decryptedKey = null
  }
})()
