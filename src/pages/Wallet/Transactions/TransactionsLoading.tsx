import React from 'react'

export default function TransactionsLoading() {
  return (
    <div className="animate-pulse pt-2">
      <div className="bg-muted h-6 w-2/5 rounded-lg mb-3"></div>
      <div className="bg-muted h-20 rounded-lg w-full mb-4"></div>
      <div className="bg-muted h-20 rounded-lg w-full mb-4"></div>
      <div className="bg-muted h-20 rounded-lg w-full mb-4"></div>
    </div>
  )
}
