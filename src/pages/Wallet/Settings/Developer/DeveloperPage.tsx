import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import Network from '../Network'

export default function DeveloperPage() {
  return (
    <>
      <AnimatedMain className="pt-5">
        <Header title="Developer Settings" showBackButton={true} />
        <Network />
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
