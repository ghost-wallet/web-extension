import React from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

const BackButton: React.FC = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center justify-center h-10 w-10 text-primarytext"
    >
      <ArrowLeftIcon className="h-6 w-6" />
    </button>
  )
}

export default BackButton
