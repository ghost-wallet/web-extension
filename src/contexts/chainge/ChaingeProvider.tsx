import React, { useState, useCallback, useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { ChaingeContext, Order } from '@/contexts/chainge/ChaingeContext'
import { fetchOrderStatus } from '@/hooks/chainge/fetchOrderStatus'

const LOCAL_STORAGE_KEY = 'chainge_orders'

const getOrdersFromLocalStorage = (): Order[] => {
  const savedOrders = localStorage.getItem(LOCAL_STORAGE_KEY)
  return savedOrders ? JSON.parse(savedOrders) : []
}

const saveOrdersToLocalStorage = (orders: Order[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders))
}

export function ChaingeProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(getOrdersFromLocalStorage())
  const location = useLocation()

  useEffect(() => {
    saveOrdersToLocalStorage(orders)
  }, [orders])

  const hasKaspaOrder = orders.some(
    (order) => order.payTokenTicker === 'KAS' || order.receiveTokenTicker === 'KAS',
  )
  const tokenTickersSet = new Set(orders.flatMap((order) => [order.payTokenTicker, order.receiveTokenTicker]))
  if (tokenTickersSet.has('KAS')) {
    tokenTickersSet.add('KASPA')
  }
  useEffect(() => {
    const shouldPoll =
      (location.pathname === '/transactions/kaspa' && hasKaspaOrder) ||
      location.pathname === '/transactions/krc20' ||
      Array.from(tokenTickersSet).some((ticker) => location.pathname === `/wallet/crypto-details/${ticker}`)

    if (!shouldPoll) return
    let isMounted = true

    const pollAllOrders = async () => {
      const activeOrders = [...orders]

      for (const order of activeOrders) {
        const pollOrderStatus = async () => {
          while (isMounted) {
            try {
              const response = await fetchOrderStatus(order.orderId)
              const { status } = response.data

              //These are the possible statuses from Chainge
              //   TxStatusUnknown    = "Unknown"
              //   TxStatusPending    = "Pending"
              //   TxStatusVerified   = "Verified"
              //   TxStatusSucceeded  = "Succeeded"
              //   TxStatusFailed     = "Failed"
              //   TxStatusDropped    = "Dropped"
              //   TxStatusWaitVerify = "WaitVerify"
              //   TxStatusRefunding  = "Refunding"
              //   TxStatusRefunded   = "Refunded"

              // These are the only 4 possible final statuses
              const finalStatuses = ['Succeeded', 'Refunded', 'Dropped', 'Failed']
              if (finalStatuses.includes(status)) {
                setOrders((prevOrders) => prevOrders.filter((o) => o.orderId !== order.orderId))
                break
              } else {
                await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait before polling again
              }
            } catch (err) {
              console.error(`Error polling order ${order.orderId}:`, err)
              break
            }
          }
        }

        pollOrderStatus()
      }
    }

    pollAllOrders()

    return () => {
      isMounted = false
    }
  }, [orders, location.pathname])

  const addOrder = useCallback((order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order])
  }, [])

  return (
    <ChaingeContext.Provider
      value={{
        orders,
        addOrder,
      }}
    >
      {children}
    </ChaingeContext.Provider>
  )
}
