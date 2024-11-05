import React from 'react'
import { Status } from '@/wallet/Wallet'
import { useNavigate } from 'react-router-dom'
import useKaspa from '@/hooks/contexts/useKaspa'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'

const LogoutButton: React.FC = () => {
  const { kaspa, request } = useKaspa()
  const navigate = useNavigate()

  const handleLogOut = () => {
    request('wallet:lock', []).catch((error) => console.error('Error locking wallet:', error))
  }

  if (kaspa.status !== Status.Unlocked) {
    navigate('/')
    return null
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <SettingsButton onClick={handleLogOut} text="Log out" LeftSideIcon={ArrowRightEndOnRectangleIcon} />
    </div>
  )
}

export default LogoutButton
