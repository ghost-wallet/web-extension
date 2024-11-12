import { useEffect, useState } from 'react'
import LocalStorage from '@/storage/LocalStorage'
import { Token } from '@/utils/interfaces'

const useInitializedEnabledTokens = (tokens: Partial<Token>[]) => {
  const [enabledTokens, setEnabledTokens] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const initializeEnabledTokens = async () => {
      const wallet = await LocalStorage.get('wallet')

      if (!wallet || !wallet.encryptedKey) {
        throw new Error('Wallet or encryptedKey is missing from local storage.')
      }

      if (!wallet.tokens) {
        wallet.tokens = {}
      }

      // Set default `isHidden: false` for any token not in wallet.tokens
      const initialEnabledTokens = tokens.reduce(
        (acc, token) => {
          const tick = token.tick
          if (tick && !wallet.tokens[tick]) {
            wallet.tokens[tick] = { isHidden: false }
          }
          if (tick) {
            acc[tick] = !wallet.tokens[tick]?.isHidden // Safe check with optional chaining
          }
          return acc
        },
        {} as { [key: string]: boolean },
      )

      await LocalStorage.set('wallet', wallet)
      setEnabledTokens(initialEnabledTokens)
    }

    initializeEnabledTokens()
  }, [tokens])

  return [enabledTokens, setEnabledTokens] as const
}

export default useInitializedEnabledTokens
