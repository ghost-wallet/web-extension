import LocalStorage from '@/storage/LocalStorage'
import React from 'react'

const useToggleTokenVisibility = (
  setEnabledTokens: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
) => {
  return async (tick: string) => {
    const wallet = await LocalStorage.get('wallet')

    if (!wallet || !wallet.encryptedKey) {
      throw new Error('Wallet or encryptedKey is missing from local storage.')
    }

    if (!wallet.tokens) {
      wallet.tokens = {}
    }

    // Toggle the `isHidden` field or initialize it if not present
    let newIsHidden
    if (!wallet.tokens[tick]) {
      wallet.tokens[tick] = { isHidden: true } // Initialize to true on first toggle
      newIsHidden = true
    } else {
      newIsHidden = !wallet.tokens[tick].isHidden
      wallet.tokens[tick].isHidden = newIsHidden
    }

    await LocalStorage.set('wallet', wallet)

    setEnabledTokens((prevState) => ({
      ...prevState,
      [tick]: !newIsHidden,
    }))
  }
}

export default useToggleTokenVisibility
