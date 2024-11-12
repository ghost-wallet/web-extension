import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { WrenchIcon } from '@heroicons/react/24/outline'

export default function DeveloperButton() {
  const navigate = useNavigate()

  const handleResetClick = () => {
    navigate('/settings/developer')
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <SettingsButton onClick={handleResetClick} text={'Developer settings'} LeftSideIcon={WrenchIcon} />
    </div>
  )
}
