import React, { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import ClickableCryptos from '@/pages/Wallet/Send/ClickableCryptos'
import Header from '@/components/Header'

export default function Send() {
  const [totalValue, setTotalValue] = useState(0)

  return (
    <>
      <AnimatedMain>
        <Header title="Send" showBackButton={true} />
        <ClickableCryptos onTotalValueChange={setTotalValue} />
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
