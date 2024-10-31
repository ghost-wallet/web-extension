import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import CryptoImage from '@/components/CryptoImage'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import TransactionIcon from '@/pages/Wallet/Transactions/TransactionIcon'
import TransactionAmountDisplay from '@/pages/Wallet/Transactions/TransactionAmountDisplay'

export default function TransactionDetails() {
  const location = useLocation()
  const { amt, tick, hashRev, operationType, isMint, isReceived } = location.state || {}

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!amt || !tick || !hashRev || !operationType) {
    return <p className="text-center text-base text-mutedtext">No transaction details available.</p>
  }

  return (
    <AnimatedMain>
      <Header title="Transaction Details" showBackButton={true} />
      <div className="space-y-3 px-4 pb-4">
        <div className="flex items-center justify-between p-4 bg-darkmuted rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="relative">
              <CryptoImage ticker={tick} size="small" />
              <div className="absolute -bottom-1 -right-1">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center border border-darkmuted">
                  <TransactionIcon operationType={operationType} />
                </div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-base text-mutedtext">{operationType}</p>
              <a
                href={`https://explorer.kaspa.org/txs/${hashRev}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm hover:text-secondary"
              >
                View Transaction
              </a>
            </div>
          </div>
          <TransactionAmountDisplay amt={amt} tick={tick} isMint={isMint} isReceived={isReceived} />
        </div>
      </div>
    </AnimatedMain>
  )
}
