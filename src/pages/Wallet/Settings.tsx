import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import Network from './Settings/Network'
import Currency from './Settings/Currency'
import LogOut from './Settings/LogOut'

export default function Settings() {
  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col">
          <h1 className="text-primarytext text-3xl font-rubik text-center mb-4">
            Settings
          </h1>
          <Network />
          <Currency />
          <LogOut />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
