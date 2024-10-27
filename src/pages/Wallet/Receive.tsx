import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import QRCode from 'react-qr-code'
import KaspaAddress from '@/components/KaspaAddress'
import useKaspa from '@/hooks/contexts/useKaspa'
import Header from '@/components/Header'

export default function Receive() {
  const { kaspa } = useKaspa()

  return (
    <>
      <AnimatedMain>
        <Header title="Receive Address" showBackButton={true} />
        <div className="pt-6 flex flex-col items-center justify-center relative w-full">
          <div className="p-2 bg-white rounded-lg">
            <QRCode style={{ height: '150px', width: '150px' }} value={kaspa.addresses[0]} />
          </div>

          <h1 className="pt-4 font-lato font-semibold text-base text-primarytext text-center">
            Your Kaspa Address
          </h1>
          <div className="py-6 w-full flex justify-center">
            <KaspaAddress address={kaspa.addresses[0]} />
          </div>

          <p className="px-6 font-lato text-base text-mutedtext text-center">
            This address can be used to receive Kaspa and KRC20 tokens.
          </p>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
