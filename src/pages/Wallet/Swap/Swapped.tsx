import React from 'react'
import { useLocation } from 'react-router-dom'
import ConfirmationPage from '@/components/ConfirmationPage'

const Swapped: React.FC = () => {
  const location = useLocation()
  const { order } = location.state || {}

  return (
    <ConfirmationPage title="Swap order submitted!">
      {order?.data?.id && (
        <a className="text-mutedtext font-bold text-lg">Chainge Order ID: {order.data.id}</a>
      )}
    </ConfirmationPage>
  )
}

export default Swapped
