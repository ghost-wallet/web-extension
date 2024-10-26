import React, { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import WalletActionButtons from '@/components/buttons/WalletActionButtons'
import CryptoList from '@/components/cryptos/CryptoList'
import TotalWalletValue from '@/components/TotalWalletValue'

export default function Wallet() {
  const [totalValue, setTotalValue] = useState<number>(0)

  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col items-center pt-10">
          <TotalWalletValue totalValue={totalValue} />
          <WalletActionButtons />
          <CryptoList onTotalValueChange={setTotalValue} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
