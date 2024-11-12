import React from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCodeIcon } from '@heroicons/react/24/outline'
import ActionButton from '@/components/buttons/ActionButton'

interface ReceiveButtonProps {
  className?: string
}

const ReceiveButton: React.FC<ReceiveButtonProps> = ({ className }) => {
  const navigate = useNavigate()

  const handleReceiveClick = () => {
    navigate('/receive')
  }

  return (
    <ActionButton
      icon={<QrCodeIcon strokeWidth={2} />}
      label="Receive"
      onClick={handleReceiveClick}
      className={className}
    />
  )
}

export default ReceiveButton
