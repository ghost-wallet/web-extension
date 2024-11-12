import React, { useState } from 'react'
import BottomNav from '@/components/navigation/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import CryptoList from '@/pages/Wallet/CryptoList' // Updated import for CryptoList
import Header from '@/components/Header'
import TopNav from '@/components/navigation/TopNav'

export default function Send() {
  const [totalValue, setTotalValue] = useState(0)

  return (
    <>
      <TopNav />
      <AnimatedMain>
        <Header title="Send" showBackButton={true} />
        <div className="flex flex-col items-center">
          <CryptoList onTotalValueChange={setTotalValue} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
