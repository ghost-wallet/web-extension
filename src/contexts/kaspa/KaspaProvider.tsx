import React, { ReactNode, useReducer, useCallback, useRef } from 'react'
import { runtime, type Runtime } from 'webextension-polyfill'
import { kaspaReducer } from './kaspaReducer'
import { KaspaContext, defaultState } from './KaspaContext'
import { MessageEntry } from './types'
import {
  Event,
  isEvent,
  Request,
  RequestMappings,
  Response,
  ResponseMappings,
} from '@/wallet/messaging/messageMappings'

export function KaspaProvider({ children }: { children: ReactNode }) {
  const [kaspa, dispatch] = useReducer(kaspaReducer, defaultState)
  const connectionRef = useRef<Runtime.Port | null>(null)
  const messagesRef = useRef(new Map<number, MessageEntry<any>>())
  const nonceRef = useRef(0)

  const request = useCallback(<M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
    const message: Request<M> = {
      id: ++nonceRef.current,
      method,
      params,
    }

    console.log(
      `[KaspaContextProvider] Sending request - method: ${method}, params:`,
      params,
      'message:',
      message,
    )

    return new Promise<ResponseMappings[M]>((resolve, reject) => {
      messagesRef.current.set(message.id, { resolve, reject, message })
      try {
        getConnection().postMessage(message)
      } catch (error) {
        console.error('[KaspaContextProvider] Error posting message:', error)
        reject(error)
      }
    })
  }, [])

  const getConnection = useCallback(() => {
    if (connectionRef.current) {
      return connectionRef.current
    }

    const connection = runtime.connect({ name: '@kaspian/client' })

    connection.onMessage.addListener(async (message: Response | Event) => {
      if (!isEvent(message)) {
        const messageEntry = messagesRef.current.get(message.id)
        if (!messageEntry) {
          console.warn('[KaspaContextProvider] No message entry found for id:', message.id)
          return
        }

        const { resolve, reject } = messageEntry
        if (!message.error) {
          resolve(message.result)
        } else {
          console.error('[KaspaContextProvider] Rejecting message with error:', message.error)
          reject(message.error)
        }

        messagesRef.current.delete(message.id)
      } else {
        await processEvent(message)
      }
    })

    connection.onDisconnect.addListener(() => {
      console.warn('[KaspaContextProvider] Connection disconnected.')
      connectionRef.current = null
      reloadState()
    })

    connectionRef.current = connection
    return connection
  }, [])

  const processEvent = async (message: Event) => {
    switch (message.event) {
      case 'node:connection':
      case 'node:network':
        await handleNodeConnectionEvent(message)
        break
      case 'wallet:status':
        dispatch({ type: 'status', payload: message.data })
        break
      case 'account:balance':
        await handleAccountBalanceEvent(message)
        break
      case 'account:addresses':
        handleAccountAddressesEvent(message)
        break
      case 'provider:connection':
        dispatch({ type: 'provider', payload: message.data })
        break
      default:
        console.log('[KaspaContextProvider] Unknown event:', message)
        break
    }
  }

  const handleNodeConnectionEvent = async (message: Event) => {
    try {
      const addresses = await request('account:addresses', [])
      dispatch({ type: 'addresses', payload: addresses })
      dispatch({ type: 'connected', payload: message.data })
    } catch (error) {
      console.error('[KaspaContextProvider] Error fetching addresses:', error)
    }
  }

  const handleAccountBalanceEvent = async (message: Event) => {
    dispatch({ type: 'balance', payload: message.data })
    try {
      const utxos = await request('account:utxos', [])
      dispatch({ type: 'utxos', payload: utxos })
    } catch (error) {
      console.error('[KaspaContextProvider] Error fetching UTXOs:', error)
    }
  }

  const handleAccountAddressesEvent = (message: Event) => {
    dispatch({
      type: 'addresses',
      payload: ({ addresses }: { addresses: [string[], string[]] | unknown }) => {
        if (
          Array.isArray(addresses) &&
          addresses.length === 2 &&
          Array.isArray(addresses[0]) &&
          Array.isArray(addresses[1]) &&
          Array.isArray(message.data) &&
          message.data.length === 2 &&
          Array.isArray(message.data[0]) &&
          Array.isArray(message.data[1])
        ) {
          return [
            [...addresses[0], ...message.data[0]],
            [...addresses[1], ...message.data[1]],
          ] as [string[], string[]]
        }
        return addresses as [string[], string[]]
      },
    })
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
