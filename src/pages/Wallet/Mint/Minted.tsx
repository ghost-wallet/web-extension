import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Title from '@/components/Header'
import CryptoImage from '@/components/CryptoImage'

const Minted: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, receiveAmount, transactionIds } = location.state || {}

  const checkmarkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: [0, 1.3, 1],
      opacity: [0, 1, 1],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  }

  return (
    <div className="flex flex-col justify-between min-h-screen bg-dark p-4">
      <div className="flex flex-col items-center">
        {/* Checkmark animation at the top */}
        <motion.div initial="hidden" animate="visible" variants={checkmarkVariants}>
          <CheckCircleIcon className="w-24 h-24 text-green-500" />
        </motion.div>

        {/* Centered content */}
        <div className="flex flex-col items-center mt-8 space-y-4">
          <Title title="Minted!" />
          <CryptoImage ticker={token.tick} size="large" />
          <p className="text-base font-lato text-mutedtext text-center">
            You minted {receiveAmount?.toLocaleString()} {token.tick}
          </p>
        </div>
      </div>

      {/* Close button at the bottom */}
      <button
        className="w-full h-[60px] text-lg font-lato font-semibold rounded-[10px] bg-muted text-primarytext cursor-pointer py-3 px-6 hover:bg-slightmuted mb-6"
        onClick={() => navigate('/wallet')}
      >
        Close
      </button>
    </div>
  )
}

export default Minted
