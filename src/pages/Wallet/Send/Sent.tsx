import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import KaspaAddress from '@/components/KaspaAddress' // Import the new KaspaAddress component

const Sent: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, amount, recipient, txnId } = location.state || {}

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.3, 1],
      opacity: [0, 1, 1],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark p-4">
      <motion.div initial="hidden" animate="visible" variants={checkmarkVariants}>
        <CheckCircleIcon className="w-24 h-24 text-green-500" />
      </motion.div>
      <h1 className="text-2xl font-lato text-primarytext mt-6">Sent!</h1>

      <p className="text-base font-lato text-mutedtext mt-4 p-6 text-center">
        {amount} {token.tick} was successfully sent to
      </p>

      <div className="flex flex-col items-center justify-center relative w-full">
        <KaspaAddress address={recipient} />
      </div>

      <a
        href={`https://explorer.kaspa.org/txs/${txnId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-lato font-bold text-lg mt-6"
      >
        View transaction
      </a>

      <button
        className="mt-20 w-full bg-muted text-primarytext text-lg font-lato font-semibold rounded-[10px] cursor-pointer py-2 px-6"
        onClick={() => navigate('/wallet')}
      >
        Close
      </button>
    </div>
  )
}

export default Sent
