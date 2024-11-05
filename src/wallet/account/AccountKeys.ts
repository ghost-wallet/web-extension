export default new (class AccountKeys {
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

  hasKey(): boolean {
    return !!this.decryptedKey
  }

  clearKey() {
    this.decryptedKey = null
  }
})()
