import React from 'react'

export default function MintLoading() {
  return (
    <div className="animate-pulse space-y-4 p-4 bg-bgdarker rounded-lg">
      {/* Left Section: Image and Name */}
      <div className="flex items-center space-x-4">
        {/* Circle for Image */}
        <div className="bg-muted h-14 w-14 rounded-full"></div>
        <div className="flex flex-col space-y-2">
          {/* Name */}
          <div className="bg-muted h-6 w-24 rounded-lg"></div>
          {/* Price */}
          <div className="bg-muted h-4 w-16 rounded-lg"></div>
        </div>
      </div>

      {/* Right Section: Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Market Cap */}
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded-lg"></div>
          <div className="bg-muted h-4 w-20 rounded-lg"></div>
        </div>
        {/* Total Supply */}
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded-lg"></div>
          <div className="bg-muted h-4 w-20 rounded-lg"></div>
        </div>
        {/* Total Minted */}
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded-lg"></div>
          <div className="bg-muted h-4 w-20 rounded-lg"></div>
        </div>
        {/* Pre-Minted */}
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded-lg"></div>
          <div className="bg-muted h-4 w-20 rounded-lg"></div>
        </div>
        {/* Mints */}
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded-lg"></div>
          <div className="bg-muted h-4 w-20 rounded-lg"></div>
        </div>
        {/* Holders */}
        <div className="space-y-2">
          <div className="bg-muted h-4 w-16 rounded-lg"></div>
          <div className="bg-muted h-4 w-20 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
