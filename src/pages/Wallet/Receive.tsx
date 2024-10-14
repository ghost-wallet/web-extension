import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import QRCode from 'react-qr-code'
import BackButton from '@/components/BackButton'
import KaspaAddress from '@/components/KaspaAddress' // Import the new component
import useKaspa from '@/hooks/useKaspa'

export default function Receive() {
  const { kaspa } = useKaspa()

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
          <BackButton />
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">Receive</h1>
          <div className="w-6" />
        </div>

        <div className="flex flex-col items-center justify-center relative w-full">
          <KaspaAddress address={kaspa.addresses[0][kaspa.addresses[0].length - 1]} />
        </div>

        <div className="flex flex-col items-center mt-16">
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
