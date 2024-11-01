import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Network from '../Network'

export default function DeveloperPage() {
  return (
    <>
      <AnimatedMain>
        <Header title="Developer Settings" showBackButton={true} />
        <Network />
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
