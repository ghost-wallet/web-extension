import React from 'react'
import Spinner from '@/components/loaders/Spinner'
import useChainge from '@/hooks/contexts/useChainge'

interface ActiveChaingeOrdersProps {
  tickerFilter?: string
}

export default function ActiveChaingeOrders({ tickerFilter }: ActiveChaingeOrdersProps) {
  const { orders } = useChainge()

  const filteredOrders = tickerFilter
    ? orders.filter(
        (order) => order.payTokenTicker === tickerFilter || order.receiveTokenTicker === tickerFilter,
      )
    : orders

  if (filteredOrders.length === 0) return null

  return (
    <div className="mb-4">
      {filteredOrders.map((order) => (
        <div key={order.orderId} className="flex items-center space-x-2">
          <p className="text-lg text-mutedtext">
            Swapping {order.payTokenTicker} for {order.receiveTokenTicker}
          </p>
          <Spinner size="medium" />
        </div>
      ))}
    </div>
  )
}
