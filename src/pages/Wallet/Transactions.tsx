import React from 'react'
import BottomNav from '@/components/BottomNav'
import useKaspa from '@/hooks/useKaspa'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'

export default function Transactions() {
  const { kaspa } = useKaspa()

  return (
    <>
      <AnimatedMain>
        <Header title="Recent Activity" showBackButton={false} />
        <div className="pt-6 text-center">
          <a
            href={`https://explorer.kaspa.org/addresses/${kaspa.addresses[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 text-lg font-lato text-primary hover:underline"
          >
            View on Kaspa Explorer
          </a>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
