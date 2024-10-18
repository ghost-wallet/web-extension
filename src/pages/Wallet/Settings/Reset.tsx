import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Reset() {
  const navigate = useNavigate()

  const handleResetClick = () => {
    navigate('/settings/reset') // Navigate to the reset confirmation page
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="bg-error hover:bg-errormuted text-secondarytext text-base font-semibold font-lato w-[240px] py-3 rounded-[25px]"
        onClick={handleResetClick}
      >
        Reset wallet
      </button>
    </div>
  )
}
