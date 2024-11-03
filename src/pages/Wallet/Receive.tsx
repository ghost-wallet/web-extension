import React, { useEffect, useState } from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import QRCode from 'react-qr-code'
import KaspaAddress from '@/components/KaspaAddress'
import useKaspa from '@/hooks/contexts/useKaspa'
import Header from '@/components/Header'
import Spinner from '@/components/Spinner'
import TopNav from '@/components/TopNav'

export default function Receive() {
  const { kaspa } = useKaspa()
  const [kaspaAddress, setKaspaAddress] = useState(kaspa.addresses[0] || '')

  useEffect(() => {
    setKaspaAddress(kaspa.addresses[0] || '')
  }, [kaspa.addresses])

  if (!kaspaAddress) {
    return (
      <>
        <AnimatedMain>
          <Header title="Receive Address" showBackButton={true} />
          <div className="flex items-center justify-center w-full h-full">
            <Spinner />
          </div>
        </AnimatedMain>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <TopNav />
      <AnimatedMain>
        <Header title="Receive Address" showBackButton={true} />
        <div className="pb-20 flex flex-col items-center justify-center relative w-full">
          <div className="p-2 bg-white rounded-lg">
            <QRCode style={{ height: '150px', width: '150px' }} value={kaspaAddress} />
          </div>

          <h1 className="py-3 font-semibold text-base text-primarytext text-center">Your Kaspa Address</h1>
          <div className="pb-2 w-full flex justify-center">
            <KaspaAddress address={kaspaAddress} />
          </div>

          <p className="px-4 text-base text-mutedtext text-center">
            This address can be used to receive Kaspa and KRC20 tokens.
          </p>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
