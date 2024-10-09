import React from 'react'
import BottomNav from '@/components/BottomNav'
import useKaspa from '@/hooks/useKaspa'
import AnimatedMain from '@/components/AnimatedMain'

export default function Txns() {
  const { kaspa } = useKaspa()

  return (
    <>
      <AnimatedMain>
        <div className="p-6">
          <h1 className="text-primarytext text-3xl font-rubik text-center mb-4">
            Transactions
          </h1>
          <a
            href={`https://explorer.kaspa.org/addresses/${kaspa.addresses[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-lato text-primary hover:underline"
          >
            View on Kaspa Explorer
          </a>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
