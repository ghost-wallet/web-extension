import React, { createContext, ReactNode, useEffect, useReducer, useCallback } from 'react'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'
import { fetchTokens } from './tokenFetcher'
import { kasplexReducer, defaultState, IKasplex } from './kasplexReducer'

export const KasplexContext = createContext<
  | {
      loadTokens: (refresh?: boolean) => Promise<void>
      kasplex: IKasplex
    }
  | undefined
>(undefined)

export function KasplexProvider({ children }: { children: ReactNode }) {
  const [kasplex, dispatch] = useReducer(kasplexReducer, defaultState)
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  const loadTokens = useCallback(
    async (refresh = false) => {
      try {
        dispatch({ type: 'loading', payload: true })
        dispatch({ type: 'error', payload: null })

        const cachedTokens = localStorage.getItem(`tokens_${kaspa.addresses?.[0]?.[0]}`)
        const cachedTimestamp = localStorage.getItem(`timestamp_${kaspa.addresses?.[0]?.[0]}`)
        const currentTime = Date.now()

        const CACHE_DURATION = 30000 // 30 seconds

        if (
          !refresh &&
          cachedTokens &&
          cachedTimestamp &&
          currentTime - parseInt(cachedTimestamp) < CACHE_DURATION
        ) {
          dispatch({ type: 'tokens', payload: JSON.parse(cachedTokens) })
        } else {
          const apiBase =
            settings.selectedNode === 0 ? 'api' : settings.selectedNode === 1 ? 'tn10api' : 'tn11api'

          const fetchedTokens = await fetchTokens(kaspa.addresses[0][0], apiBase, price)

          dispatch({ type: 'tokens', payload: fetchedTokens })

          // TODO better local storage consistency across files (e.g. localStorage vs LocalStorage)
          localStorage.setItem(`tokens_${kaspa.addresses[0][0]}`, JSON.stringify(fetchedTokens))
          localStorage.setItem(`timestamp_${kaspa.addresses[0][0]}`, currentTime.toString())
        }
      } catch (err) {
        dispatch({ type: 'error', payload: `Error fetching KRC20 tokens: ${err}` })
      } finally {
        dispatch({ type: 'loading', payload: false })
      }
    },
    [kaspa.addresses, settings.selectedNode, price],
  )

  useEffect(() => {
    if (kaspa.connected && kaspa.addresses.length > 0 && kaspa.addresses[0].length > 0) {
      loadTokens()
    }
  }, [kaspa.connected, kaspa.addresses, loadTokens])

  return <KasplexContext.Provider value={{ kasplex, loadTokens }}>{children}</KasplexContext.Provider>
}
