import React, { useState } from 'react'
import BottomNav from '@/components/navigation/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import WalletActionButtons from '@/components/buttons/WalletActionButtons'
import CryptoList from '@/pages/Wallet/CryptoList'
import TotalWalletValue from '@/components/TotalWalletValue'
import TopNav from '@/components/navigation/TopNav'
import ManageTokensButton from '@/pages/Wallet/CryptoList/ManageTokensButton'

export default function Wallet() {
  const [totalValue, setTotalValue] = useState<number>(0)

  return (
    <>
      <TopNav />
      <AnimatedMain>
        <div className="flex flex-col items-center pt-4">
          <TotalWalletValue totalValue={totalValue} />
          <WalletActionButtons />
          <CryptoList onTotalValueChange={setTotalValue} />
          <ManageTokensButton />
          <div className="pb-20" />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
