import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useKaspa from '@/hooks/useKaspa'

interface AnimatedMainProps {
  children: React.ReactNode
  className?: string
}

const AnimatedMain: React.FC<AnimatedMainProps> = ({ children, className }) => {
  const { kaspa } = useKaspa()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (!kaspa.connected) {
      setShowError(true)
    } else {
      setShowError(false)
    }
  }, [kaspa.connected])

  return (
    <>
      {showError && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-1 bg-red-700 text-primarytext font-lato text-sm">
          <p>Error: Not connected to Kaspa network</p>
        </div>
      )}
      <motion.main
        className={`${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: 'easeInOut' }}
      >
        {children}
      </motion.main>
    </>
  )
}

export default AnimatedMain
