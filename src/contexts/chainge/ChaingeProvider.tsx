import React, { useState, useCallback, useEffect, type ReactNode } from 'react'
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

  useEffect(() => {
    saveOrdersToLocalStorage(orders)
  }, [orders])

  useEffect(() => {
    const pollAllOrders = async () => {
      const activeOrders = [...orders]

      for (const order of activeOrders) {
        const pollOrderStatus = async () => {
          while (true) {
            try {
              const response = await fetchOrderStatus(order.orderId)
              const { status } = response.data

              // TODO are there other statuses?
              if (status === 'Succeeded' || status === 'Refunded') {
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
  }, [orders])

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
