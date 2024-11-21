import React from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '@/components/navigation/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import TopNav from '@/components/navigation/TopNav'
import NextButton from '@/components/buttons/NextButton'
import Header from '@/components/Header'

export default function Marketplace() {
  const navigate = useNavigate()

  return (
    <>
      <TopNav />
      <AnimatedMain className={`flex flex-col h-screen w-full fixed`}>
        <Header showBackButton={false} title="Marketplace" />
        <div className="p-4">
          <NextButton text="Buy" onClick={() => {}} />
        </div>
        <div className="p-4">
          <NextButton text="Sell" onClick={() => navigate('/marketplace/sell')} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
