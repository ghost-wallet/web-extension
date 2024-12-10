import React from 'react'
import { motion } from 'framer-motion'
import { formatGasFee } from '@/utils/formatting'

interface GasFeeProps {
  fee: string | number
}

const AnimatedGasFee: React.FC<GasFeeProps> = ({ fee }) => {
  return (
    <motion.div
      key={fee} // Trigger animation when the fee changes
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="text-base text-primarytext"
    >
      {formatGasFee(fee)} KAS
    </motion.div>
  )
}

export default React.memo(AnimatedGasFee)
