import React, { ReactNode, useEffect, useReducer, useCallback } from 'react'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'
import { fetchOperations } from './getOperationList'
import { fetchTokens } from './tokenFetcher'
import { kasplexReducer, defaultState } from './kasplexReducer'
import { fetchData, getApiBase } from './fetchHelper' // Import the helper function
import { KasplexContext } from './KasplexContext'

export function KasplexProvider({ children }: { children: ReactNode }) {
  const [kasplex, dispatch] = useReducer(kasplexReducer, defaultState)
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  const loadTokens = useCallback(async () => {
    const apiBase = getApiBase(settings.selectedNode)

    await fetchData(() => fetchTokens(kaspa.addresses[0][0], apiBase, price), dispatch, 'tokens', 'error')
  }, [kaspa.addresses, settings.selectedNode, price])

  const loadOperations = useCallback(
    async (tick?: string, next?: string, prev?: string) => {
      const apiBase = getApiBase(settings.selectedNode)

      const response = await fetchOperations({ address: kaspa.addresses[0][0], apiBase, tick, next, prev })

      dispatch({
        type: 'operations',
        payload: {
          ...kasplex.operations,
          result: [...kasplex.operations.result, ...response.result], // Append new results
          next: response.next, // Update next cursor
        },
      })
    },
    [kasplex.operations, kaspa.addresses, settings.selectedNode],
  )

  useEffect(() => {
    if (kaspa.connected && kaspa.addresses.length > 0 && kaspa.addresses[0].length > 0) {
      loadTokens()
    }
  }, [kaspa.connected, kaspa.addresses, loadTokens])

  return (
    <KasplexContext.Provider value={{ kasplex, loadTokens, loadOperations }}>
      {children}
    </KasplexContext.Provider>
  )
}
