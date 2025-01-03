import React, { useEffect } from 'react'
import { motion } from 'framer-motion'

interface AnimatedMainProps {
  children: React.ReactNode
  className?: string
  showConnectingMessage?: boolean
}

const AnimatedMain: React.FC<AnimatedMainProps> = ({ children, className }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <motion.main
      className={`${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
    >
      {children}
    </motion.main>
  )
}

export default AnimatedMain
