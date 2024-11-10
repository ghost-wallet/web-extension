import React from 'react'

interface ErrorMessageProps {
  message: string
  className?: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  return (
    <div className={`${className}`}>
      {message ? (
        <p className="text-error text-base text-justify">{message}</p>
      ) : (
        <p className="text-transparent text-sm text-center">No error</p>
      )}
    </div>
  )
}

export default ErrorMessage
