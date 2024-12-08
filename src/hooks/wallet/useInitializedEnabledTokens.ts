import { useEffect, useState } from 'react'
import LocalStorage from '@/storage/LocalStorage'
import { Token } from '@/utils/interfaces'
import useSettings from '@/hooks/contexts/useSettings'

const useInitializedEnabledTokens = (tokens: Partial<Token>[]) => {
  const { settings } = useSettings()
  const [enabledTokens, setEnabledTokens] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const initializeEnabledTokens = async () => {
      const wallet = await LocalStorage.get('walletV2')

      if (!wallet || !wallet.encryptedKey) {
        throw new Error('Wallet or encryptedKey is missing from local storage.')
      }

      if (!wallet.accounts[settings.activeAccount].tokens) {
        wallet.accounts[settings.activeAccount].tokens = {}
      }

      // Set default `isHidden: false` for any token not in wallet.tokens
      const initialEnabledTokens = tokens.reduce(
        (acc, token) => {
          const tick = token.tick
          if (tick && !wallet.accounts[settings.activeAccount].tokens[tick]) {
            wallet.accounts[settings.activeAccount].tokens[tick] = { isHidden: false }
          }
          if (tick) {
            acc[tick] = !wallet.accounts[settings.activeAccount].tokens[tick]?.isHidden // Safe check with optional chaining
          }
          return acc
        },
        {} as { [key: string]: boolean },
      )

      await LocalStorage.set('walletV2', wallet)
      setEnabledTokens(initialEnabledTokens)
    }

    initializeEnabledTokens()
  }, [tokens])

  return [enabledTokens, setEnabledTokens] as const
}

export default useInitializedEnabledTokens
