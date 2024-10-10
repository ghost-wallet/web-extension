import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/wallet/kaspa/wallet'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import ActionButtons from '@/components/ActionButtons'
import Cryptos from '@/pages/Wallet/Cryptos'
import TotalValue from '@/pages/Wallet/TotalValue'

export default function Wallet() {
  const { kaspa } = useKaspa()
  const navigate = useNavigate()
  const [totalValue, setTotalValue] = useState<number>(0)

  if (kaspa.status !== Status.Unlocked) {
    navigate('/unlock')
    return null // Prevent further rendering until unlocked
  }

  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col items-center">
          <div className="sticky top-0 bg-bgdark w-full flex flex-col border-b border-muted">
            <div className="items-center flex flex-col pt-6">
              <TotalValue totalValue={totalValue} />
              <ActionButtons />
            </div>
            <h2 className="text-2xl text-primarytext font-lato text-left w-full px-4 pb-4">
              Cryptos
            </h2>
          </div>
          <Cryptos onTotalValueChange={setTotalValue} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
