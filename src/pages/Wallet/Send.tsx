import React, { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import BackButton from '@/components/BackButton'
import ClickableCryptos from '@/pages/Wallet/Send/ClickableCryptos'

export default function Send() {
  const [totalValue, setTotalValue] = useState(0)

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">Send</h1>
          <div className="w-6" />
        </div>
        {/* Render ClickableCryptos instead of Cryptos */}
        <ClickableCryptos onTotalValueChange={setTotalValue} />
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
