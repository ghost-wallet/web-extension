import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Network from '@/pages/Wallet/Settings/Network'
import Currency from '@/pages/Wallet/Settings/Currency'
import Scan from '@/pages/Wallet/Settings/Scan'
import LogOut from '@/pages/Wallet/Settings/LogOut'
import Reset from '@/pages/Wallet/Settings/Reset'
import CompoundUTXOs from '@/pages/Wallet/Settings/CompoundUTXOs'

export default function Settings() {
  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col p-6">
          <h1 className="text-primarytext text-3xl font-rubik text-center mb-4">Settings</h1>
          <Network />
          <Currency />
          <div className="mt-14 flex flex-col">
            <CompoundUTXOs />
          </div>
          <div className="mt-1 flex flex-col">
            <LogOut />
          </div>
          <div className="mt-1 flex flex-col">
            <Reset />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
