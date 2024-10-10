import React from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import BackButton from '@/components/BackButton'

export default function Send() {
  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Send
          </h1>
          <div className="w-6" />
          {/* This div is for spacing to balance the button */}
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
