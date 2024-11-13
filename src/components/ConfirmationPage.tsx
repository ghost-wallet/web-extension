import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import Title from '@/components/Header'
import CloseButton from '@/components/buttons/CloseButton'

interface ConfirmationPageProps {
  title: string
  children: React.ReactNode
}

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.3, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ title, children }) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col min-h-screen bg-dark p-4">
      <div className="flex flex-col items-center">
        <Title title={title} />
        <motion.div initial="hidden" animate="visible" variants={checkmarkVariants}>
          <CheckCircleIcon className="w-24 h-24 text-success" />
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">{children}</div>

      <div className="mt-auto">
        <CloseButton onClick={() => navigate('/wallet')} />
      </div>
    </div>
  )
}

export default ConfirmationPage
