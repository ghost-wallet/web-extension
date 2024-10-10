import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'

export default function Swap() {
  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Swap
          </h1>
          <div className="w-6" />
        </div>
        <p className="text-primarytext text-base p-6">Coming soon...</p>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
