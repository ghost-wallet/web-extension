import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { UserIcon } from '@heroicons/react/24/outline'

export default function AccountButton() {
  const navigate = useNavigate()

  const handleResetClick = () => {
    navigate('/settings/accounts')
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <SettingsButton onClick={handleResetClick} text={'Manage accounts'} LeftSideIcon={UserIcon} />
    </div>
  )
}
