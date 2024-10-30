import React from 'react'

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="h-6 mb-4 mt-2 flex justify-center items-center">
      {message ? (
        <p className="text-error text-base text-center">{message}</p>
      ) : (
        <p className="text-transparent text-sm text-center">No error</p>
      )}
    </div>
  )
}

export default ErrorMessage
