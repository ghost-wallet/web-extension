import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Network from '@/pages/Wallet/Settings/Network'
import Currency from '@/pages/Wallet/Settings/Currency'
import LogOut from '@/pages/Wallet/Settings/LogOut'
import Reset from '@/pages/Wallet/Settings/Reset'

export default function Settings() {
  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col p-6">
          <h1 className="text-primarytext text-3xl font-rubik text-center mb-4">Settings</h1>
          <Network />
          <Currency />
          <div className="mt-24 flex flex-col w-full">
            <Reset />
          </div>
          <div className="mt-2 flex flex-col w-full">
            <LogOut />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
