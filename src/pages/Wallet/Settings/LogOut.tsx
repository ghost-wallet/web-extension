import React, { useEffect } from 'react'
import { Status } from '@/wallet/kaspa/wallet'
import { useNavigate } from 'react-router-dom'
import useKaspa from '@/hooks/contexts/useKaspa'

const LogOut: React.FC = () => {
  const { kaspa, request } = useKaspa()
  const navigate = useNavigate()

  const handleLogOut = () => {
    request('wallet:lock', []).catch((error) => console.error('Error locking wallet:', error))
  }

  useEffect(() => {
    if (kaspa.status !== Status.Unlocked) {
      navigate('/')
    }
  }, [kaspa.status])

  return (
    <div className="flex flex-col items-center gap-2 mb-2">
      <button
        onClick={handleLogOut}
        className="bg-primary hover:bg-secondary text-secondarytext text-base font-semibold font-lato w-[240px] px-8 py-3 rounded-[25px]"
      >
        Log out
      </button>
    </div>
  )
}

export default LogOut
