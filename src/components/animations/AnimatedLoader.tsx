import React from 'react'
import { motion } from 'framer-motion'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

const loadingVariants = {
  spin: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      ease: 'linear',
      duration: 2,
    },
  },
}

const AnimatedLoader: React.FC = () => (
  <motion.div animate="spin" variants={loadingVariants} className="flex items-center justify-center">
    <ArrowPathIcon className="w-28 h-28 text-primary" />
  </motion.div>
)

export default AnimatedLoader
