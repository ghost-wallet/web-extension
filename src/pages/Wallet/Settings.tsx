import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Network from '@/pages/Wallet/Settings/Network'
import LogOut from '@/pages/Wallet/Settings/LogOut'
import Reset from '@/pages/Wallet/Settings/Reset'
import Header from '@/components/Header'

export default function Settings() {
  return (
    <>
      <AnimatedMain>
        <Header title="Settings" showBackButton={false} />
        <Network />
        <div className="mt-1 flex flex-col">
          <LogOut />
        </div>
        <div className="mt-1 flex flex-col">
          <Reset />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
