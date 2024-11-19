import React from 'react'

const LoadingPlaceholder: React.FC<{ className: string }> = ({ className }) => (
  <div className={`bg-gray-300 animate-pulse ${className}`} />
)

export default function LoadingCreateMint() {
  return (
    <>
        <div className="flex flex-col flex-grow px-4 space-y-4">
          {/* Placeholder for CryptoImage */}
          <LoadingPlaceholder className="w-20 h-20 mx-auto rounded-full" />

          {/* Placeholder for MintAmountInput */}
          <LoadingPlaceholder className="w-full h-12 rounded-md" />

          {/* Placeholder for MintSummary */}
          <LoadingPlaceholder className="w-full h-10 rounded-md" />

          {/* Placeholder for MintRateInfo */}
          <LoadingPlaceholder className="w-full h-10 rounded-md" />
        </div>
    </>
  )
}
