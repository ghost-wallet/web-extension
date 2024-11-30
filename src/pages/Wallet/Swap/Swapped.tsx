import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useChainge from '@/hooks/contexts/useChainge'
import ErrorMessage from '@/components/messages/ErrorMessage'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'
import CloseButton from '@/components/buttons/CloseButton'
import NextButton from '@/components/buttons/NextButton'
import useOrderStatus from '@/hooks/chainge/useOrderStatus'
import AnimatedLoader from '@/components/animations/AnimatedLoader'
import AnimatedCheckmark from '@/components/animations/AnimatedCheckmark'

const Swapped: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { order, receiveToken, payToken } = location.state || {}
  const { addOrder } = useChainge()

  const getTicker = (token: any) =>
    token?.contractAddress === 'CUSDT' ? token.contractAddress : token.symbol

  useEffect(() => {
    if (order?.data?.id) {
      const newOrder = {
        orderId: order.data.id,
        payTokenTicker: getTicker(payToken),
        receiveTokenTicker: getTicker(receiveToken),
      }
      addOrder(newOrder)
    }
  }, [order?.data?.id, payToken, receiveToken, addOrder])

  const { status, loading, error } = useOrderStatus({ order })

  return (
    <div className="p-4">
      {loading && !error && order?.data?.id && (
        <div className="flex flex-col items-center space-y-2 pt-10">
          <AnimatedLoader />
          <h1 className="text-xl text-primarytext">Swapping tokens...</h1>
          <p className="text-lg text-mutedtext text-center">
            {receiveToken?.contractAddress === 'CUSDT' ? receiveToken.contractAddress : receiveToken.symbol}{' '}
            will be deposited into your wallet once the transaction is complete
          </p>
        </div>
      )}
      {error && (
        <div className="pt-20">
          <ErrorMessage message={error} />
        </div>
      )}
      {!loading && !error && status === 'Succeeded' && (
        <div className="flex flex-col items-center space-y-2 pt-10">
          <AnimatedCheckmark />
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
