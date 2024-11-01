import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import LogoutButton from '@/pages/Wallet/Settings/LogoutButton'
import ResetButton from '@/pages/Wallet/Settings/ResetButton'
import Header from '@/components/Header'
import AboutButton from '@/pages/Wallet/Settings/AboutButton'
import DeveloperButton from '@/pages/Wallet/Settings/DeveloperButton'

export default function Settings() {
  return (
    <>
      <AnimatedMain>
        <Header title="Settings" showBackButton={false} />
        <div className="mt-1 flex flex-col">
          <AboutButton />
        </div>
        <div className="mt-1 flex flex-col">
          <LogoutButton />
        </div>
        <div className="mt-1 flex flex-col">
          <DeveloperButton />
        </div>
        <div className="mt-1 flex flex-col">
          <ResetButton />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
