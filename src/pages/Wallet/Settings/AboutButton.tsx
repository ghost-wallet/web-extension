import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

export default function AboutButton() {
  const navigate = useNavigate()

  const handleResetClick = () => {
    navigate('/settings/about')
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <SettingsButton onClick={handleResetClick} text={'About'} LeftSideIcon={InformationCircleIcon} />
    </div>
  )
}
