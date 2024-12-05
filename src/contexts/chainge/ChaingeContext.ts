import { createContext } from 'react'

export interface Order {
  orderId: string
  payTokenTicker: string
  receiveTokenTicker: string
}

export const ChaingeContext = createContext<
  | {
      orders: Order[]
      addOrder: (order: Order) => void
    }
  | undefined
>(undefined)
