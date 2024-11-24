import React from 'react'

export default function ReceiveLoading() {
  return (
    <div className="flex justify-center w-full h-full">
      <div className="w-full max-w-md p-4 space-y-4">
        {/* QR Code Loader */}
        <div className="w-44 h-44 mx-auto bg-muted animate-pulse rounded-lg" />

        {/* Title Loader */}
        <div className="h-4 bg-muted animate-pulse rounded-md mx-auto w-3/4" />

        {/* Address Loader */}
        <div className="h-20 bg-muted animate-pulse rounded-md mx-auto w-7/8" />

        {/* Description Loader */}
        <div className="h-4 bg-muted animate-pulse rounded-md mx-auto w-3/4" />
      </div>
    </div>
  )
}
