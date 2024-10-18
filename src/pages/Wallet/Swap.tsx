import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Header from '@/components/Header'

export default function Swap() {
  return (
    <>
      <AnimatedMain>
        <Header title="Swap" showBackButton={true} />
        <p className="text-primarytext text-base p-6">Coming soon...</p>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
