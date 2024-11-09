import React from 'react'

export default function SwapLoading() {
  return (
    <div className="animate-pulse space-y-4 p-4 bg-bgdarker rounded-lg">
      <div className="bg-muted h-14 rounded-lg w-full mb-4"></div>
      <div className="flex items-center justify-between space-x-4">
        <div className="bg-muted h-7 w-1/3 rounded-lg"></div>
        <div className="bg-muted h-7 w-1/3 rounded-lg"></div>
      </div>
      <div className="flex items-center justify-center">
        <div className="bg-muted h-10 w-10 rounded-full"></div>
      </div>
      <div className="bg-muted h-14 rounded-lg w-full mt-8"></div>
      <div className="flex items-center justify-between space-x-4 mt-4">
        <div className="bg-muted h-7 w-1/3 rounded-lg"></div>
        <div className="bg-muted h-7 w-1/3 rounded-lg"></div>
      </div>
    </div>
  )
}
