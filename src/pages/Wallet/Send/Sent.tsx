import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const Sent: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, amount, recipient } = location.state || {}

  // Check if required props are available
  if (!token || !amount || !recipient) {
    return <div>Transaction details are missing.</div>
  }

  // Utility function to truncate the recipient address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark p-4">
      <CheckCircleIcon className="w-24 h-24 text-green-500" />
      <h1 className="text-2xl font-lato text-primarytext mt-6">Sent!</h1>
      <p className="text-base font-lato text-mutedtext mt-4">
        {amount} {token.tick} was successfully sent to {truncateAddress(recipient)}.
      </p>
      <a
        href="https://kas.fyi"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-lato font-bold text-lg mt-6"
      >
        View transaction
      </a>
      <button
        className="mt-8 w-full h-12 bg-secondarytext text-dark font-lato font-semibold rounded-full"
        onClick={() => navigate('/wallet')}
      >
        Close
      </button>
    </div>
  )
}

export default Sent
