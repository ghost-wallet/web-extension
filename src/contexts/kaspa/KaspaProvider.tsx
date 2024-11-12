import React, { ReactNode, useReducer, useCallback, useRef } from 'react'
import { runtime, type Runtime } from 'webextension-polyfill'
import { kaspaReducer } from './kaspaReducer'
import { KaspaContext, defaultState } from './KaspaContext'
import { MessageEntry } from './types'
import {
  handleAccountBalanceEvent,
  handleNodeConnectionEvent,
  handleAccountAddressesEvent,
} from './eventHandlers'
import { Request, RequestMappings, isEvent, Event } from '@/wallet/messaging/RequestMappings'
import { Response, ResponseMappings } from '@/wallet/messaging/ResponseMappings'

export function KaspaProvider({ children }: { children: ReactNode }) {
  const [kaspa, dispatch] = useReducer(kaspaReducer, defaultState)
  const connectionRef = useRef<Runtime.Port | null>(null)
  const messagesRef = useRef(new Map<number, MessageEntry<any>>())
  const nonceRef = useRef(0)

  const request = useCallback(<M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
    const message: Request<M> = { id: ++nonceRef.current, method, params }
    return new Promise<ResponseMappings[M]>((resolve, reject) => {
      messagesRef.current.set(message.id, { resolve, reject, message })
      try {
        getConnection().postMessage(message)
      } catch (error) {
        reject(error)
      }
    })
  }, [])

  const getConnection = useCallback(() => {
    if (connectionRef.current) {
      return connectionRef.current
    }
    const connection = runtime.connect({ name: '@ghost/client' })
    connection.onMessage.addListener(async (message: Response | Event) => {
      if (!isEvent(message)) {
        const messageEntry = messagesRef.current.get(message.id)
        if (messageEntry) {
          if (!message.error) messageEntry.resolve(message.result)
          else messageEntry.reject(message.error)
          messagesRef.current.delete(message.id)
        }
      } else {
        await processEvent(message)
      }
    })
    connection.onDisconnect.addListener(async () => {
      connectionRef.current = null
      await reloadState()
    })
    connectionRef.current = connection
    return connection
  }, [])

  const processEvent = async (message: Event) => {
    switch (message.event) {
      case 'node:connection':
      case 'node:network':
        await handleNodeConnectionEvent(dispatch, message, request)
        break
      case 'wallet:status':
        dispatch({ type: 'status', payload: message.data })
        break
      case 'account:balance':
        await handleAccountBalanceEvent(dispatch, message, request)
        break
      case 'account:addresses':
        await handleAccountAddressesEvent(dispatch, request)
        break
      case 'provider:connection':
        dispatch({ type: 'provider', payload: message.data })
        break
      default:
        console.log('[KaspaContextProvider] Unknown event:', message)
    }
  }

  const reloadState = useCallback(async () => {
    try {
      const status = await request('wallet:status', [])
      dispatch({ type: 'status', payload: status })
      const connected = await request('node:connection', [])
      dispatch({ type: 'connected', payload: connected })
      const balance = await request('account:balance', [])
      dispatch({ type: 'balance', payload: balance })
      const utxos = await request('account:utxos', [])
      dispatch({ type: 'utxos', payload: utxos })
      const addresses = await request('account:addresses', [])
      dispatch({ type: 'addresses', payload: addresses })
      const provider = await request('provider:connection', [])
      dispatch({ type: 'provider', payload: provider })
    } catch (error) {
      console.error('[KaspaContextProvider] Error during reload:', error)
    }
  }, [request])

  return (
    <KaspaContext.Provider value={{ load: reloadState, kaspa, request }}>{children}</KaspaContext.Provider>
  )
}
