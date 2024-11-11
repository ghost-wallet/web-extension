import React from 'react'
import { motion } from 'framer-motion'
import SwapTokenListItem from '@/pages/Wallet/Swap/SwapTokenListItem'
import { ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import Spinner from '@/components/loaders/Spinner'
import ErrorMessage from '@/components/messages/ErrorMessage'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface SwapTokenSelectProps {
  tokens: ChaingeToken[]
  onSelectToken: (token: ChaingeToken) => void
  onClose: () => void
  loading: boolean
  error: string | null
}

const SwapTokenSelect: React.FC<SwapTokenSelectProps> = ({
  tokens,
  onSelectToken,
  onClose,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <div className="mt-6">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} className="h-6 mb-4 mt-2 flex justify-center items-center" />
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-bgdark bg-opacity-90 p-4 flex flex-col"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Header with Title and Close Button */}
      <div className="relative flex items-center justify-center mb-6">
        <button
          className="absolute left-0 flex items-center justify-center text-2xl font-bold h-10 w-10 rounded-full transition-colors duration-200 hover:bg-bgdarker hover:text-primarytext"
          onClick={onClose}
          aria-label="Close token selection"
        >
          <XMarkIcon className="h-6 w-6 text-mutedtext transition-colors duration-200 hover:text-primarytext" />
        </button>
        <h2 className="text-primarytext text-2xl">Select Token</h2>
      </div>

      {/* Token List */}
      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-3">
          {tokens.map((token) => (
            <li
              key={token.contractAddress}
              onClick={() => onSelectToken(token)}
              className="w-full text-left transition-colors hover:cursor-pointer rounded-lg"
            >
              <SwapTokenListItem token={token} />
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default SwapTokenSelect
