import React from 'react'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="h-6 mb-4">
      {message ? (
        <p className="text-error text-sm">{message}</p>
      ) : (
        <p className="text-transparent text-sm">No error</p>
      )}
    </div>
  )
}

export default ErrorMessage
