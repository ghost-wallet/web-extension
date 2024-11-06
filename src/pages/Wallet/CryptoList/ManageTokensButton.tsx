import React from 'react'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const ManageTokensButton: React.FC = () => {
  const navigate = useNavigate()

  const handleManageTokensClick = () => {
    navigate('/wallet/manage')
  }

  return (
    <div className="pb-4 -mt-20">
      <button
        onClick={handleManageTokensClick}
        className="flex items-center mt-4 text-mutedtext hover:text-primary text-xl"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
        Manage Tokens
      </button>
    </div>
  )
}

export default ManageTokensButton
