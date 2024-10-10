import { createContext, useReducer, ReactNode, useCallback, useRef, useState } from 'react'
import { runtime, type Runtime } from 'webextension-polyfill'
import { Status } from '@/wallet/kaspa/wallet'
import {
  Request,
  Response,
  Event,
  RequestMappings,
  ResponseMappings,
  isEvent,
} from '@/wallet/messaging/protocol'
import { UTXO } from '@/wallet/kaspa/account'

export interface IKaspa {
  status: Status
  connected: boolean
  addresses: [string[], string[]]
  balance: number
  utxos: UTXO[]
  provider: string
}

interface MessageEntry<M extends keyof RequestMappings> {
  resolve: (value: ResponseMappings[M]) => void
  reject: (reason?: any) => void
  message: Request<M>
}

export const defaultState: IKaspa = {
  status: Status.Uninitialized,
  connected: false,
  addresses: [[], []],
  balance: 0,
  utxos: [],
  provider: '',
}

export const KaspaContext = createContext<
  | {
      load: () => Promise<void>
      kaspa: IKaspa
      request: <M extends keyof RequestMappings>(
        method: M,
        params: RequestMappings[M],
      ) => Promise<ResponseMappings[M]>
      networkLoading: boolean
      setNetworkLoading: (loading: boolean) => void
    }
  | undefined
>(undefined)

type Action<K extends keyof IKaspa> = {
  type: K
  payload: IKaspa[K] | ((oldState: IKaspa) => IKaspa[K])
}

function kaspaReducer(state: IKaspa, action: Action<keyof IKaspa>): IKaspa {
  const { type, payload } = action
  console.log(`[KaspaProvider] Dispatching action of type "${type}", payload:`, payload)

  if (typeof payload === 'function') {
    return { ...state, [type]: payload(state) }
  } else {
    return { ...state, [type]: payload }
  }
}

export function KaspaProvider({ children }: { children: ReactNode }) {
  const [kaspa, dispatch] = useReducer(kaspaReducer, defaultState)
  const [networkLoading, setNetworkLoading] = useState(false)

  const connectionRef = useRef<Runtime.Port | null>(null)
  const messagesRef = useRef(new Map<number, MessageEntry<any>>())
  const nonceRef = useRef(0)

  const request = useCallback(
    <M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
      setNetworkLoading(true)
      console.log(
        `[KaspaProvider] Sending request - Method: ${method}, Params: ${JSON.stringify(params)}`,
      )
      const message: Request<M> = {
        id: ++nonceRef.current,
        method,
        params,
      }

      const start = performance.now()

      return new Promise<ResponseMappings[M]>((resolve, reject) => {
        messagesRef.current.set(message.id, { resolve, reject, message })
        try {
          console.log('[KaspaProvider] Posting message to connection.')
          getConnection().postMessage(message)
        } catch (error) {
          console.error('[KaspaProvider] Error posting message:', error)
          setNetworkLoading(false)
          reject(error)
        }
      })
        .then((result) => {
          console.log(
            `[KaspaProvider] Request successful in ${performance.now() - start}ms:`,
            result,
          )
          setNetworkLoading(false)
          return result
        })
        .catch((error) => {
          console.error(`[KaspaProvider] Request failed in ${performance.now() - start}ms:`, error)
          setNetworkLoading(false)
          throw error
        })
    },
    [],
  )

  const getConnection = useCallback(() => {
    if (connectionRef.current) return connectionRef.current

    console.warn('[KaspaProvider] Establishing new connection.')
    const connection = runtime.connect({ name: '@kaspian/client' })

    connection.onMessage.addListener(async (message: Response | Event) => {
      console.log('[KaspaProvider] Message received:', message)
      if (!isEvent(message)) {
        const messageEntry = messagesRef.current.get(message.id)
        if (!messageEntry) {
          console.warn('[KaspaProvider] No matching message entry found for ID:', message.id)
          return
        }

        const { resolve, reject } = messageEntry
        if (!message.error) {
          resolve(message.result)
        } else {
          console.error('[KaspaProvider] Message returned an error:', message.error)
          reject(message.error)
        }

        messagesRef.current.delete(message.id)
      } else {
        console.log(`[KaspaProvider] Processing event - ${message.event}`)
        switch (message.event) {
          case 'node:connection':
          case 'node:network': {
            const start = performance.now()
            try {
              console.log('[KaspaProvider] Fetching addresses after network event.')
              const addresses = await request('account:addresses', [])
              if (addresses && addresses.length) {
                dispatch({ type: 'addresses', payload: addresses })
                console.log('[KaspaProvider] Addresses updated successfully.')
              }
              dispatch({ type: 'connected', payload: message.data })
              console.log(
                `[KaspaProvider] "connected" action dispatched in ${performance.now() - start}ms`,
              )
            } catch (error) {
              console.error('[KaspaProvider] Error fetching addresses:', error)
            }
            break
          }
          case 'wallet:status':
            console.log('[KaspaProvider] Updating wallet status.')
            dispatch({ type: 'status', payload: message.data })
            break
          case 'account:balance':
            console.log('[KaspaProvider] Updating balance.')
            dispatch({ type: 'balance', payload: message.data })
            try {
              const utxos = await request('account:utxos', [])
              dispatch({ type: 'utxos', payload: utxos })
              console.log('[KaspaProvider] UTXOs updated successfully.')
            } catch (error) {
              console.error('[KaspaProvider] Error fetching UTXOs:', error)
            }
            break
          case 'account:addresses':
            console.log('[KaspaProvider] Updating addresses.')
            dispatch({
              type: 'addresses',
              payload: ({ addresses }) => {
                if (message.data && message.data.length) {
                  return [
                    addresses[0].concat(message.data[0] || []),
                    addresses[1].concat(message.data[1] || []),
                  ]
                }
                return addresses
              },
            })
            break
          case 'provider:connection':
            console.log('[KaspaProvider] Updating provider connection.')
            dispatch({ type: 'provider', payload: message.data })
            break
          default:
            console.warn(`[KaspaProvider] Unhandled event type - ${message}`)
            break
        }
      }
    })

    connection.onDisconnect.addListener(() => {
      console.warn('[KaspaProvider] Connection disconnected. Attempting to reconnect...')
      if (
        runtime.lastError?.message !==
        'Could not establish connection. Receiving end does not exist.'
      ) {
        return
      }

      connectionRef.current = null
      console.log('[KaspaProvider] Re-establishing connection...')

      for (const entry of messagesRef.current.values()) {
        getConnection().postMessage(entry.message)
      }

      load()
    })

    connectionRef.current = connection
    return connection
  }, [kaspa.addresses])

  const load = useCallback(async () => {
    try {
      console.log('[KaspaProvider] Loading state...')
      setNetworkLoading(true)
      const status = await request('wallet:status', [])
      dispatch({ type: 'status', payload: status })

      const connected = await request('node:connection', [])
      dispatch({ type: 'connected', payload: connected })

      const balance = await request('account:balance', [])
      dispatch({ type: 'balance', payload: balance })

      const utxos = await request('account:utxos', [])
      dispatch({ type: 'utxos', payload: utxos })

      const addresses = await request('account:addresses', [])
      if (addresses && addresses.length) {
        dispatch({ type: 'addresses', payload: addresses })
      }

      const provider = await request('provider:connection', [])
      dispatch({ type: 'provider', payload: provider })
      console.log('[KaspaProvider] State loaded successfully.')
    } catch (error) {
      console.error('[KaspaProvider] Error during load:', error)
    } finally {
      setNetworkLoading(false)
    }
  }, [request])

  return (
    <KaspaContext.Provider value={{ load, kaspa, request, networkLoading, setNetworkLoading }}>
      {children}
    </KaspaContext.Provider>
  )
}
