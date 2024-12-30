import { useEffect, useState, useMemo } from 'react'
import LocalStorage from '@/storage/LocalStorage'
import { AccountToken } from '@/types/interfaces'

const useVisibleTokens = (tokens: (AccountToken)[]) => {
  const [visibleTokens, setVisibleTokens] = useState<(AccountToken)[]>([])

  const memoizedTokens = useMemo(() => tokens, [tokens])

  useEffect(() => {
    const filterTokens = async () => {
      const wallet = await LocalStorage.get('wallet')

      if (!wallet || !wallet.tokens) {
        console.warn('No tokens found in LocalStorage.')
        setVisibleTokens(memoizedTokens)
        return
      }

      const filteredTokens = memoizedTokens.filter((token) => {
        const storedToken = wallet.tokens[token.tick]
        return storedToken ? !storedToken.isHidden : true
      })

      setVisibleTokens((prevTokens) =>
        JSON.stringify(prevTokens) !== JSON.stringify(filteredTokens) ? filteredTokens : prevTokens,
      )
    }

    filterTokens()
  }, [memoizedTokens])

  return visibleTokens
}

export default useVisibleTokens
