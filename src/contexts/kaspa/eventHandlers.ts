import { Dispatch } from 'react'
import { Event } from '@/wallet/messaging/RequestMappings'
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

export const handleAccountAddressesEvent = async (dispatch: Dispatch<Action<any>>, request: any) => {
  try {
    const addresses = await request('account:addresses', [])
    console.log('eventHandlers handleAccountAddressesEvent addresses', addresses)
    dispatch({ type: 'addresses', payload: addresses })
  } catch (error) {
    console.error('[KaspaContextProvider] Error fetching addresses:', error)
  }
}
