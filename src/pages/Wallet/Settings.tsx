import React, { useEffect } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Network from './Settings/Network'
import Currency from './Settings/Currency'
import LogOut from './Settings/LogOut'

export default function Settings() {
  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col p-6">
          <h1 className="text-primarytext text-3xl font-rubik text-center mb-4">
            Settings
          </h1>
          <Network />
          <Currency />
          <div className="mt-32 flex flex-col items-center">
            <LogOut />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
