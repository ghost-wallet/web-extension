import { Dispatch } from 'react'
import { Event } from '@/wallet/messaging/messageMappings'
import { Action } from './types'

export const handleNodeConnectionEvent = async (
  dispatch: Dispatch<Action<any>>,
  message: Event,
  request: any,
) => {
  try {
    const addresses = await request('account:addresses', [])
    dispatch({ type: 'addresses', payload: addresses })
    dispatch({ type: 'connected', payload: message.data })
  } catch (error) {
    console.error('[KaspaContextProvider] Error fetching addresses:', error)
  }
}

export const handleAccountBalanceEvent = async (
  dispatch: Dispatch<Action<any>>,
  message: Event,
  request: any,
) => {
  dispatch({ type: 'balance', payload: message.data })
  try {
    const utxos = await request('account:utxos', [])
    dispatch({ type: 'utxos', payload: utxos })
  } catch (error) {
    console.error('[KaspaContextProvider] Error fetching UTXOs:', error)
  }
}

export const handleAccountAddressesEvent = (dispatch: Dispatch<Action<any>>, message: Event) => {
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
