import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useKaspa from '@/hooks/contexts/useKaspa'
import Spinner from '@/components/Spinner'
import useSettings from '@/hooks/contexts/useSettings'

interface AnimatedMainProps {
  children: React.ReactNode
  className?: string
  showConnectingMessage?: boolean
}

const AnimatedMain: React.FC<AnimatedMainProps> = ({ children, className, showConnectingMessage = true }) => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()

  return (
    <>
      {!kaspa.connected && showConnectingMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-slightmuted text-primarytext text-sm p-1">
          <p className="pl-4">{`Connecting to ${settings.nodes[settings.selectedNode].address}...`}</p>
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
