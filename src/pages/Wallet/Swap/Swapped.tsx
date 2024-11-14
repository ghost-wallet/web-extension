import React from 'react'
import { useLocation } from 'react-router-dom'
import ConfirmationPage from '@/components/ConfirmationPage'

const Swapped: React.FC = () => {
  const location = useLocation()
  const { order } = location.state || {}

  return (
    <ConfirmationPage title="Swap order submitted!">
      <a className="text-primary font-bold text-lg">Order ID: {order?.data?.id}</a>
    </ConfirmationPage>
  )
}

export default Swapped
