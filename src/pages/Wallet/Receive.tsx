import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import QRCode from 'react-qr-code'
import KaspaAddress from '@/components/KaspaAddress'
import useKaspa from '@/hooks/useKaspa'
import Header from '@/components/Header'

export default function Receive() {
  const { kaspa } = useKaspa()

  return (
    <>
      <AnimatedMain>
        <Header title="Receive" showBackButton={true} />

        <div className="flex flex-col items-center justify-center relative w-full">
          <p className="p-6 font-lato text-base text-primarytext">
            You can receive Kaspa or any KRC20 token to your Kaspa address.
          </p>
          <KaspaAddress address={kaspa.addresses[0][kaspa.addresses[0].length - 1]} />
        </div>

        <div className="flex flex-col items-center mt-6">
          <QRCode
            style={{ height: 'auto', width: '45%' }}
            value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
          />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
