import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

export default function PreferencesButton() {
  const navigate = useNavigate()

  const handleResetClick = () => {
    navigate('/settings/preferences')
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <SettingsButton
        onClick={handleResetClick}
        text={'Preferences'}
        LeftSideIcon={AdjustmentsHorizontalIcon}
      />
    </div>
  )
}
