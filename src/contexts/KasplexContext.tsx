import React, { createContext, ReactNode, useEffect, useReducer, useCallback } from 'react'
import axios from 'axios'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'

export interface Token {
  tick: string
  balance: string
  opScoreMod: string
  dec: string
  floorPrice?: number
}

interface ApiResponse {
  result: Token[]
}

interface TokenInfoResponse {
  price?: {
    floorPrice?: number
  }
}

interface IKasplex {
  tokens: Token[]
  loading: boolean
  error: string | null
}

export const defaultState: IKasplex = {
  tokens: [],
  loading: true,
  error: null,
}

export const KasplexContext = createContext<
  | {
      loadTokens: (refresh?: boolean) => Promise<void>
      kasplex: IKasplex
    }
  | undefined
>(undefined)

type Action<K extends keyof IKasplex> = {
  type: K
  payload: IKasplex[K]
}

function kasplexReducer(state: IKasplex, action: Action<keyof IKasplex>): IKasplex {
  const { type, payload } = action

  return { ...state, [type]: payload }
}

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

        // Fetch tokens if cache is invalid or refresh is requested
        if (
          !refresh &&
          cachedTokens &&
          cachedTimestamp &&
          currentTime - parseInt(cachedTimestamp) < CACHE_DURATION
        ) {
          dispatch({ type: 'tokens', payload: JSON.parse(cachedTokens) })
          dispatch({ type: 'loading', payload: false })
        } else {
          const apiBase =
            settings.selectedNode === 0 ? 'api' : settings.selectedNode === 1 ? 'tn10api' : 'tn11api'

          console.log('[KasplexContext] Fetching KRC20 tokens from Kasplex...')
          const response = await axios.get<ApiResponse>(
            `https://${apiBase}.kasplex.org/v1/krc20/address/${kaspa.addresses[0][kaspa.addresses[0].length - 1]}/tokenlist`,
          )

          if (response.data && response.data.result) {
            const tokensWithPrices = await Promise.all(
              response.data.result.map(async (token: Token) => {
                try {
                  const tokenInfoResponse = await axios.get<TokenInfoResponse>(
                    `https://api-v2-do.kas.fyi/token/krc20/${token.tick}/info`,
                  )
                  const tokenData = tokenInfoResponse.data
                  const floorPrice = ((tokenData?.price?.floorPrice || 0) * price).toFixed(8)

                  return { ...token, floorPrice: parseFloat(floorPrice) }
                } catch (err) {
                  console.error(`Error fetching info for ${token.tick}:`, err)
                  return { ...token, floorPrice: 0 }
                }
              }),
            )

            dispatch({ type: 'tokens', payload: tokensWithPrices })

            //TODO use a more consistent local storage. This one saves to the chrome devtools actual local storage, whereas the other LocalStorage usages are saving to memory.
            localStorage.setItem(`tokens_${kaspa.addresses[0][0]}`, JSON.stringify(tokensWithPrices))
            localStorage.setItem(`timestamp_${kaspa.addresses[0][0]}`, currentTime.toString())
          } else {
            throw new Error('Invalid API response structure')
          }
        }
      } catch (err) {
        console.error('Error fetching tokens:', err)
        dispatch({ type: 'error', payload: 'Error fetching tokens' })
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
