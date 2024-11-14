import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface WarningMessageProps {
  message: string
}

const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
  return (
    <div className="bg-warning text-secondarytext text-base pl-2 pr-4 py-4 rounded-lg flex items-start space-x-2">
      <ExclamationTriangleIcon className="w-7 h-7 flex-shrink-0 m-1" />
      <span>{message}</span>
    </div>
  )
}

export default WarningMessage
