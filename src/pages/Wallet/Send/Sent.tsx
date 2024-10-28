import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import KaspaAddress from '@/components/KaspaAddress'
import Title from '@/components/Header'
import CloseButton from '@/components/buttons/CloseButton'

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
    <div className="flex flex-col min-h-screen bg-dark p-4">
      <div className="flex flex-col items-center">
        <Title title="Sent!" />
        <motion.div initial="hidden" animate="visible" variants={checkmarkVariants}>
          <CheckCircleIcon className="w-24 h-24 text-success" />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <a
          href={`https://explorer.kaspa.org/txs/${txnId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-lato font-bold text-lg hover:underline"
        >
          View transaction
        </a>
        <p className="text-base font-lato text-mutedtext p-4 text-center">
          {amount.toLocaleString()} {token.tick} was successfully sent to
        </p>
        <KaspaAddress address={recipient} />
      </div>

      <div className="mt-auto">
        <CloseButton onClick={() => navigate('/wallet')} />
      </div>
    </div>
  )
}

export default Sent
