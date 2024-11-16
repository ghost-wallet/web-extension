import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { WrenchIcon } from '@heroicons/react/24/outline'

export default function SupportButton() {
  const navigate = useNavigate()

  const handleResetClick = () => {
    navigate('/settings/support')
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <SettingsButton onClick={handleResetClick} text={'Help & Support'} LeftSideIcon={WrenchIcon} />
    </div>
  )
}
