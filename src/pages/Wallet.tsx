import React, { useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import WalletActionButtons from '@/components/buttons/WalletActionButtons'
import CryptoList from '@/pages/Wallet/CryptoList'
import TotalWalletValue from '@/components/TotalWalletValue'
import TopNav from '@/components/TopNav'

export default function Wallet() {
  const [totalValue, setTotalValue] = useState<number>(0)

  return (
    <>
      <TopNav />
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
