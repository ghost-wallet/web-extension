import React, { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import CryptoList from '@/components/cryptos/CryptoList' // Updated import for CryptoList
import Header from '@/components/Header'

export default function Send() {
  const [totalValue, setTotalValue] = useState(0)

  return (
    <>
      <AnimatedMain>
        <Header title="Send" showBackButton={true} />
        <CryptoList onTotalValueChange={setTotalValue} />
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
