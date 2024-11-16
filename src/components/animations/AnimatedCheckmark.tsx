import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.3, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
}

const AnimatedCheckmark: React.FC = () => (
  <motion.div initial="hidden" animate="visible" variants={checkmarkVariants}>
    <CheckCircleIcon className="w-28 h-28 text-success" />
  </motion.div>
)

export default AnimatedCheckmark
