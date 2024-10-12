import {
  createContext,
  useReducer,
  ReactNode,
  useCallback,
  useRef,
  useState,
  useEffect,
} from 'react'
import { runtime, type Runtime } from 'webextension-polyfill'
import { Status } from '@/wallet/kaspa/wallet'
import {
  Request,
  Response,
  Event,
  RequestMappings,
  ResponseMappings,
  isEvent,
} from '@/wallet/messaging/messageMappings'
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
    }
  | undefined
>(undefined)

type Action<K extends keyof IKaspa> = {
  type: K
  payload: IKaspa[K] | ((oldState: IKaspa) => IKaspa[K])
}

function kaspaReducer(state: IKaspa, action: Action<keyof IKaspa>): IKaspa {
  const { type, payload } = action
  console.log(`[KaspaContextProvider] Action received - type: ${type}, payload:`, payload)

  if (typeof payload === 'function') {
    const newState = { ...state, [type]: payload(state) }
    console.log('[KaspaContextProvider] New state after function payload:', newState)
    return newState
  } else {
    const newState = { ...state, [type]: payload }
    console.log('[KaspaContextProvider] New state after direct payload:', newState)
    return newState
  }
}

export function KaspaProvider({ children }: { children: ReactNode }) {
  const [kaspa, dispatch] = useReducer(kaspaReducer, defaultState)
  console.log('[KaspaContextProvider] Initialized state:', kaspa)

  const connectionRef = useRef<Runtime.Port | null>(null)
  const messagesRef = useRef(new Map<number, MessageEntry<any>>())
  const nonceRef = useRef(0)

  const request = useCallback(
    <M extends keyof RequestMappings>(method: M, params: RequestMappings[M]) => {
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
          console.log('[KaspaContextProvider] Message posted:', message)
        } catch (error) {
          console.error('[KaspaContextProvider] Error posting message:', error)
          reject(error)
        }
      })
    },
    [],
  )

  const getConnection = useCallback(() => {
    if (connectionRef.current) {
      console.log('[KaspaContextProvider] Using existing connection.')
      return connectionRef.current
    }

    const connection = runtime.connect({ name: '@kaspian/client' })
    console.log('[KaspaContextProvider] New connection created.')

    connection.onMessage.addListener(async (message: Response | Event) => {
      console.log('[KaspaContextProvider] Message received:', message)

      if (!isEvent(message)) {
        const messageEntry = messagesRef.current.get(message.id)
        if (!messageEntry) {
          console.warn('[KaspaContextProvider] No message entry found for id:', message.id)
          return
        }

        const { resolve, reject } = messageEntry
        if (!message.error) {
          console.log('[KaspaContextProvider] Resolving message with result:', message.result)
          resolve(message.result)
        } else {
          console.error('[KaspaContextProvider] Rejecting message with error:', message.error)
          reject(message.error)
        }

        messagesRef.current.delete(message.id)
      } else {
        console.log('[KaspaContextProvider] Processing event:', message.event)
        switch (message.event) {
          case 'node:connection':
          case 'node:network':
            try {
              const addresses = await request('account:addresses', [])
              console.log('[KaspaContextProvider] Fetched addresses:', addresses)
              if (addresses && addresses.length) {
                console.log('[KaspaContextProvider] Dispatching addresses:', addresses)
                dispatch({ type: 'addresses', payload: addresses })
              }
              dispatch({ type: 'connected', payload: message.data })
            } catch (error) {
              console.error('[KaspaContextProvider] Error fetching addresses:', error)
            }
            break
          case 'wallet:status':
            console.log('[KaspaContextProvider] Dispatching wallet status:', message.data)
            dispatch({ type: 'status', payload: message.data })
            break
          case 'account:balance':
            console.log('[KaspaContextProvider] Dispatching account balance:', message.data)
            dispatch({ type: 'balance', payload: message.data })
            try {
              const utxos = await request('account:utxos', [])
              console.log('[KaspaContextProvider] Fetched UTXOs:', utxos)
              dispatch({ type: 'utxos', payload: utxos })
            } catch (error) {
              console.error('[KaspaContextProvider] Error fetching UTXOs:', error)
            }
            break
          case 'account:addresses':
            console.log('[KaspaContextProvider] Received addresses event:', message.data)
            dispatch({
              type: 'addresses',
              payload: ({ addresses }) => {
                if (message.data && message.data.length) {
                  return [
                    [...addresses[0], ...message.data[0]], // Merge the existing and new addresses
                    [...addresses[1], ...message.data[1]],
                  ] as [string[], string[]]
                }
                return addresses
              },
            })
            break
          case 'provider:connection':
            console.log('[KaspaContextProvider] Dispatching provider connection:', message.data)
            dispatch({ type: 'provider', payload: message.data })
            break
          default:
            console.log('[KaspaContextProvider] Unknown event:', message)
            break
        }
      }
    })

    connection.onDisconnect.addListener(() => {
      console.warn('[KaspaContextProvider] Connection disconnected.')

      if (
        runtime.lastError?.message !==
        'Could not establish connection. Receiving end does not exist.'
      ) {
        return
      }

      connectionRef.current = null

      for (const entry of messagesRef.current.values()) {
        console.log('[KaspaContextProvider] Re-sending message after reconnect:', entry.message)
        getConnection().postMessage(entry.message)
      }

      // Reload state after reconnecting
      load()
    })

    connectionRef.current = connection
    return connection
  }, [kaspa.addresses])

  const load = useCallback(async () => {
    try {
      const status = await request('wallet:status', [])
      console.log('[KaspaContextProvider] Loaded wallet status:', status)
      dispatch({ type: 'status', payload: status })

      const connected = await request('node:connection', [])
      console.log('[KaspaContextProvider] Loaded connection status:', connected)
      dispatch({ type: 'connected', payload: connected })

      const balance = await request('account:balance', [])
      console.log('[KaspaContextProvider] Loaded account balance:', balance)
      dispatch({ type: 'balance', payload: balance })

      const utxos = await request('account:utxos', [])
      console.log('[KaspaContextProvider] Loaded UTXOs:', utxos)
      dispatch({ type: 'utxos', payload: utxos })

      const addresses = await request('account:addresses', [])
      console.log('[KaspaContextProvider] Loaded addresses:', addresses)
      if (addresses && addresses.length) {
        dispatch({ type: 'addresses', payload: addresses })
      }

      const provider = await request('provider:connection', [])
      console.log('[KaspaContextProvider] Loaded provider connection:', provider)
      dispatch({ type: 'provider', payload: provider })
    } catch (error) {
      console.error('[KaspaContextProvider] Error during load:', error)
    }
  }, [request])

  return <KaspaContext.Provider value={{ load, kaspa, request }}>{children}</KaspaContext.Provider>
}
