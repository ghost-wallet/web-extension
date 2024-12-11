import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import LogoutButton from '@/pages/Wallet/Settings/LogoutButton'
import ResetButton from '@/pages/Wallet/Settings/ResetButton'
import Header from '@/components/Header'
import AboutButton from '@/pages/Wallet/Settings/AboutButton'
import DeveloperButton from '@/pages/Wallet/Settings/DeveloperButton'
import BottomNav from '@/components/navigation/BottomNav'
import AccountButton from '@/pages/Wallet/Settings/AccountButton'
import SupportButton from '@/pages/Wallet/Settings/Support'
import PreferencesButton from '@/pages/Wallet/Settings/PreferencesButton'

export default function Settings() {
  return (
    <>
      <AnimatedMain className="pt-5 h-screen flex flex-col justify-between">
        <div>
          <Header title="Settings" showBackButton={true} />
          <div className="mt-1 flex flex-col">
            <AccountButton />
          </div>
          <div className="mt-1 flex flex-col">
            <PreferencesButton />
          </div>
          <div className="mt-1 flex flex-col">
            <AboutButton />
          </div>
          <div className="mt-1 flex flex-col">
            <SupportButton />
          </div>
          <div className="mt-1 flex flex-col">
            <DeveloperButton />
          </div>
          <div className="mt-1 flex flex-col">
            <ResetButton />
          </div>
          <div className="mt-1 flex flex-col">
            <LogoutButton />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
