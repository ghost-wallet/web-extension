import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchOrderStatus, OrderStatusResponse } from '@/hooks/chainge/fetchOrderStatus'
import { motion } from 'framer-motion'
import { CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import ErrorMessage from '@/components/messages/ErrorMessage'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import CloseButton from '@/components/buttons/CloseButton'
import NextButton from '@/components/buttons/NextButton'

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.3, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
}

const loadingVariants = {
  spin: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      ease: 'linear',
      duration: 2,
    },
  },
}

const Swapped: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { order, receiveToken } = location.state || {}
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
        setError(err.message)
        setLoading(false)
      }
    }

    pollOrderStatus()
  }, [order])

  return (
    <div className="p-4">
      {loading && !error && order?.data?.id && (
        <div className="flex flex-col items-center space-y-2 pt-10">
          <motion.div animate="spin" variants={loadingVariants} className="flex items-center justify-center">
            <ArrowPathIcon className="w-28 h-28 text-primary" />
          </motion.div>
          <h1 className="text-xl text-primarytext">Swapping tokens...</h1>
          <p className="text-lg text-mutedtext text-center">
            {receiveToken?.symbol} will be deposited into your wallet once the transaction is complete
          </p>
        </div>
      )}
      {error && (
        <div className="pt-20">
          {' '}
          <ErrorMessage message={error} />{' '}
        </div>
      )}
      {!loading && !error && status === 'Succeeded' && (
        <div className="flex flex-col items-center space-y-2 pt-10">
          <motion.div initial="hidden" animate="visible" variants={checkmarkVariants}>
            <CheckCircleIcon className="w-28 h-28 text-success" />
          </motion.div>
          <h1 className="text-xl text-primarytext">It's done!</h1>
          <p className="text-lg text-mutedtext text-center">Tokens have been deposited into your wallet</p>
        </div>
      )}
      <BottomFixedContainer className="p-4" shadow={false}>
        {loading ? (
          <CloseButton onClick={() => navigate('/wallet')} />
        ) : (
          <NextButton onClick={() => navigate('/wallet')} text="Close" />
        )}
      </BottomFixedContainer>
    </div>
  )
}

export default Swapped
