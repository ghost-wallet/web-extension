import LocalStorage from '@/storage/LocalStorage'
import React from 'react'
import useSettings from '@/hooks/contexts/useSettings'

const useToggleTokenVisibility = (
  setEnabledTokens: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
) => {
  const { settings } = useSettings()
  return async (tick: string) => {
    const wallet = await LocalStorage.get('walletV2')

    if (!wallet || !wallet.encryptedKey) {
      throw new Error('Wallet or encryptedKey is missing from local storage.')
    }

    if (!wallet.accounts[settings.activeAccount].tokens) {
      wallet.accounts[settings.activeAccount].tokens = {}
    }

    // Toggle the `isHidden` field or initialize it if not present
    let newIsHidden
    if (!wallet.accounts[settings.activeAccount].tokens[tick]) {
      wallet.accounts[settings.activeAccount].tokens[tick] = { isHidden: true } // Initialize to true on first toggle
      newIsHidden = true
    } else {
      newIsHidden = !wallet.accounts[settings.activeAccount].tokens[tick].isHidden
      wallet.accounts[settings.activeAccount].tokens[tick].isHidden = newIsHidden
    }

    await LocalStorage.set('walletV2', wallet)

    setEnabledTokens((prevState) => ({
      ...prevState,
      [tick]: !newIsHidden,
    }))
  }
}

export default useToggleTokenVisibility
