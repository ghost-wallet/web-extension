import { useEffect, useState, useMemo } from 'react'
import LocalStorage from '@/storage/LocalStorage'
import { Token, KaspaToken } from '@/utils/interfaces'
import useSettings from '@/hooks/contexts/useSettings'

const useVisibleTokens = (tokens: (Token | KaspaToken)[]) => {
  const { settings } = useSettings()
  const [visibleTokens, setVisibleTokens] = useState<(Token | KaspaToken)[]>([])

  const memoizedTokens = useMemo(() => tokens, [tokens])

  useEffect(() => {
    const filterTokens = async () => {
      const wallet = await LocalStorage.get('walletV2')
      console.log(
        'wallet at settings active account',
        wallet,
        settings.activeAccount,
        wallet?.accounts[settings.activeAccount],
      )

      if (!wallet || !wallet.accounts[settings.activeAccount].tokens) {
        console.warn('No tokens found in LocalStorage.')
        setVisibleTokens(memoizedTokens)
        return
      }

      const filteredTokens = memoizedTokens.filter((token) => {
        const storedToken = wallet.accounts[settings.activeAccount].tokens[token.tick]
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
