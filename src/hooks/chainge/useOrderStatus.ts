import { useState, useEffect, useRef } from 'react'
import { fetchOrderStatus, OrderStatusResponse } from '@/hooks/chainge/fetchOrderStatus'

interface UseOrderStatusProps {
  order: any
  onSuccess?: (orderId: string) => void
}

const useOrderStatus = ({ order, onSuccess }: UseOrderStatusProps) => {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const pollingRef = useRef<Record<string, boolean>>({}) // Tracks polling per orderId

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

    const orderId = order.data.id
    pollingRef.current[orderId] = true // Start polling for this order

    const pollOrderStatus = async () => {
      try {
        const response: OrderStatusResponse = await fetchOrderStatus(orderId)

        if (response.data.status === 'Succeeded') {
          setStatus('Succeeded')
          setLoading(false)
          pollingRef.current[orderId] = false // Stop polling for this order
          console.log(`Order ${orderId} succeeded.`)

          // Call onSuccess callback if provided
          if (onSuccess) {
            onSuccess(orderId)
          }
        } else if (pollingRef.current[orderId]) {
          setTimeout(pollOrderStatus, 1000)
        }
      } catch (err: any) {
        if (pollingRef.current[orderId]) {
          setError(err.message || 'An unexpected error occurred while fetching order status.')
          setLoading(false)
        }
      }
    }

    pollOrderStatus()

    return () => {
      pollingRef.current[orderId] = false // Ensure polling stops explicitly for this orderId
    }
  }, [order, onSuccess])

  return { status, loading, error }
}

export default useOrderStatus
