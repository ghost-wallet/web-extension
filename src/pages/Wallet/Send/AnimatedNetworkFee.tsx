import React from 'react'
import { motion } from 'framer-motion'

interface NetworkFeeProps {
  fee: string | number
}

const AnimatedNetworkFee: React.FC<NetworkFeeProps> = ({ fee }) => {
  return (
    <motion.div
      key={fee} // Trigger animation when the fee changes
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="text-base text-primarytext"
    >
      {fee} KAS
    </motion.div>
  )
}

export default React.memo(AnimatedNetworkFee)
