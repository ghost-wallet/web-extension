import { useState, useEffect } from 'react'
import { fetchOrderStatus, OrderStatusResponse } from '@/hooks/chainge/fetchOrderStatus'

interface UseOrderStatusProps {
  order: any
}

const useOrderStatus = ({ order }: UseOrderStatusProps) => {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!order?.data?.id) {
      if (order?.msg) {
        setError(`Chainge DEX error: ${order?.msg}`)
        console.error('Chainge DEX error:', order)
      } else if (order?.data?.reason) {
        setError(`Chainge DEX error: ${order?.data?.reason}`)
        console.error('Chainge DEX error:', order)
      } else {
        setError(`Unknown error occurred using Chainge DEX: ${JSON.stringify(order)}`)
        console.error('Unknown Chainge DEX error:', order)
      }
      setLoading(false)
      return
    }

    const pollOrderStatus = async () => {
      try {
        const response: OrderStatusResponse = await fetchOrderStatus(order.data.id)
        if (response.data.status === 'Succeeded') {
          setStatus('Succeeded')
          setLoading(false)
        } else {
          setTimeout(pollOrderStatus, 1000)
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred while fetching order status.')
        setLoading(false)
      }
    }

    pollOrderStatus()
  }, [order])

  return { status, loading, error }
}

export default useOrderStatus
