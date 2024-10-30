import React from 'react'
import SwapTokenListItem from '@/pages/Wallet/Swap/SwapTokenListItem'
import { ChaingeToken } from '@/hooks/chainge/fetchChaingeTokens'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'

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
    return <ErrorMessage message={error} />
  }

  return (
    <div className="fixed inset-0 z-50 bg-bgdark bg-opacity-90 p-4 flex flex-col">
      {/* Header with Title and Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-center text-primarytext text-2xl">Select Token</h2>
        <button
          className="text-white text-2xl font-bold"
          onClick={onClose}
          aria-label="Close token selection"
        >
          &times;
        </button>
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
    </div>
  )
}

export default SwapTokenSelect
