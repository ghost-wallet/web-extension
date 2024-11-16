import React from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalContainerProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

const ModalContainer: React.FC<ModalContainerProps> = ({ title, onClose, children }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-bgdark bg-opacity-90 p-4 flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="relative flex items-center justify-center mb-6">
        <button
          className="absolute left-0 flex items-center justify-center text-2xl font-bold h-10 w-10 rounded-full transition-colors duration-200 hover:bg-bgdarker hover:text-primarytext"
          onClick={onClose}
          aria-label={`Close ${title.toLowerCase()}`}
        >
          <XMarkIcon className="h-6 w-6 text-mutedtext transition-colors duration-200 hover:text-primarytext" />
        </button>
        <h2 className="text-primarytext text-2xl">{title}</h2>
      </div>
      <div className="flex-grow overflow-y-auto">{children}</div>
    </motion.div>
  )
}

export default ModalContainer
