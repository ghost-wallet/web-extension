import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Title from '@/components/Header'
import CryptoImage from '@/components/CryptoImage'
import CloseButton from '@/components/buttons/CloseButton'
import { getKaspaExplorerAddressUrl } from '@/utils/transactions'

const Minted: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token, receiveAmount, payAmount, scriptAddress } = location.state || {}

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
          <CheckCircleIcon className="w-24 h-24 text-success" />
        </motion.div>

        {/* Centered content */}
        <div className="flex flex-col items-center mt-8 space-y-4">
          <Title title={`${receiveAmount?.toLocaleString()} ${token.tick} is being minted!`} />
          <CryptoImage ticker={token.tick} size="large" />
          <p className="text-base text-mutedtext text-center">
            Estimated time until completion:{' '}
            {(payAmount * 5.63 + 100) / 60 > 1
              ? `${((payAmount * 5.63 + 100) / 60).toFixed(2)} minutes`
              : 'Less than a minute'}
            . You can track progress in your KRC20 recent activity or on the{' '}
            <a
              href={getKaspaExplorerAddressUrl(scriptAddress)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Kaspa Explorer
            </a>
            .
          </p>
        </div>
      </div>

      <CloseButton onClick={() => navigate('/wallet')} />
    </div>
  )
}

export default Minted
