import React, { ReactNode, useEffect, useReducer, useCallback } from 'react'
import useKaspa from '@/hooks/contexts/useKaspa'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import { fetchKRC20TransactionHistory } from './fetchKrc20TransactionHistory'
import { fetchTokens } from './fetchKrc20Tokens'
import { kasplexReducer, defaultState } from './kasplexReducer'
import { fetchData, getApiBase } from './fetchHelper'
import { KasplexContext } from './KasplexContext'

export function KasplexProvider({ children }: { children: ReactNode }) {
  const [kasplex, dispatch] = useReducer(kasplexReducer, defaultState)
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useKaspaPrice(settings.currency)

  const loadKrc20Tokens = useCallback(
    async (refresh = false) => {
      const apiBase = getApiBase(settings.selectedNode)

      await fetchData(
        () => fetchTokens(kaspa.addresses[0][0], apiBase, price, refresh),
        dispatch,
        'tokens',
        'error',
      )
    },
    [kaspa.addresses, settings.selectedNode, price],
  )

  const loadKrc20Transactions = useCallback(
    async (tick?: string, next?: string, prev?: string) => {
      const apiBase = getApiBase(settings.selectedNode)
      const response = await fetchKRC20TransactionHistory({
        address: kaspa.addresses[0][0], // Fetch address from kaspa context
        apiBase, // Fetch API base URL
        tick, // Optional token filter
        next, // Optional pagination
        prev, // Optional pagination
      })
      return response // Do not store the response in context, return it to the caller
    },
    [kaspa.addresses, settings.selectedNode],
  )

  useEffect(() => {
    if (kaspa.connected && kaspa.addresses.length > 0 && kaspa.addresses[0].length > 0) {
      loadKrc20Tokens()
    }
  }, [kaspa.connected, kaspa.addresses, loadKrc20Tokens])

  return (
    <KasplexContext.Provider value={{ kasplex, loadKrc20Tokens, loadKrc20Transactions }}>
      {children}
    </KasplexContext.Provider>
  )
}
