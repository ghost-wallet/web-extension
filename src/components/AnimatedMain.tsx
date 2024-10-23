import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useKaspa from '@/hooks/useKaspa'
import Spinner from '@/components/Spinner'

interface AnimatedMainProps {
  children: React.ReactNode
  className?: string
  showConnectingMessage?: boolean
}

const AnimatedMain: React.FC<AnimatedMainProps> = ({ children, className, showConnectingMessage = true }) => {
  const { kaspa } = useKaspa()
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    if (!kaspa.connected) {
      setIsConnecting(true)
    } else {
      setIsConnecting(false)
    }
  }, [kaspa.connected])

  return (
    <>
      {isConnecting && showConnectingMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-slightmuted text-primarytext font-lato text-sm p-1">
          <p className="pl-4">Connecting to Kaspa network...</p>
          <div className="p-1">
            <Spinner size={'small'} />
          </div>
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
