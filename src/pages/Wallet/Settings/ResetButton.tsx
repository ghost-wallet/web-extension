import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { MinusCircleIcon } from '@heroicons/react/24/outline'

export default function ResetButton() {
  const navigate = useNavigate()

  const handleResetClick = () => {
    navigate('/settings/reset')
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <SettingsButton onClick={handleResetClick} text={'Reset wallet'} LeftSideIcon={MinusCircleIcon} />
    </div>
  )
}
