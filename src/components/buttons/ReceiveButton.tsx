import React from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCodeIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'

const ReceiveButton: React.FC = () => {
  const navigate = useNavigate()

  const handleReceiveClick = () => {
    navigate('/receive')
  }

  return <ActionButton icon={<QrCodeIcon strokeWidth={2} />} label="Receive" onClick={handleReceiveClick} />
}

export default ReceiveButton
