import React from 'react'
import { useNavigate } from 'react-router-dom'
import useKaspa from '@/hooks/contexts/useKaspa'
import CloseButton from '@/components/buttons/CloseButton'

const LogoutButton: React.FC = () => {
  const { request } = useKaspa()
  const navigate = useNavigate()

  const handleLogOut = () => {
    request('wallet:lock', []).catch((error) => console.error('Error locking wallet:', error))
    navigate('/')
  }

  return (
    <div className="flex flex-col py-1 px-4">
      <CloseButton onClick={handleLogOut} text="Log out" />
    </div>
  )
}

export default LogoutButton
