import React, { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Cryptos from '@/pages/Wallet/Cryptos' // Updated import for Cryptos
import Header from '@/components/Header'

export default function Send() {
  const [totalValue, setTotalValue] = useState(0)

  return (
    <>
      <AnimatedMain>
        <Header title="Send" showBackButton={true} />
        <Cryptos onTotalValueChange={setTotalValue} refresh={true} />
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
