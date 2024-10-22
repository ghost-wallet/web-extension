import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status } from '@/wallet/kaspa/wallet'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import WalletActionButtons from '@/components/buttons/WalletActionButtons'
import Cryptos from '@/pages/Wallet/Cryptos'
import TotalWalletValue from '@/components/TotalWalletValue'

export default function Wallet() {
  const { kaspa, request } = useKaspa()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const [totalValue, setTotalValue] = useState<number>(0)

  useEffect(() => {
    if (!kaspa.connected) {
      console.warn('Kaspa is not connected. Attempting to connect...')
      request('node:connect', [settings.nodes[settings.selectedNode].address])
        .then(() => {
          console.log('Successfully connected to the node.')
        })
        .catch((error) => {
          console.error('Error connecting to node:', error)
        })
    }

    if (kaspa.status !== Status.Unlocked) {
      navigate('/')
    }
  }, [kaspa.status])

  return (
    <>
      <AnimatedMain>
        <div className="flex flex-col items-center pt-10">
          <TotalWalletValue totalValue={totalValue} />
          <WalletActionButtons />
          <Cryptos onTotalValueChange={setTotalValue} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
