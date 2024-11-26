import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import QRCode from 'react-qr-code'
import KaspaAddress from '@/components/KaspaAddress'
import useKaspa from '@/hooks/contexts/useKaspa'
import Header from '@/components/Header'
import TopNav from '@/components/navigation/TopNav'
import ReceiveLoading from '@/pages/Wallet/Receive/ReceiveLoading'

export default function Receive() {
  const { kaspa } = useKaspa()
  console.log('kaspa addresses:', kaspa.addresses)
  const receiveAddress = kaspa.addresses[0] || ''

  if (!receiveAddress || !kaspa.connected) {
    return (
      <>
        <TopNav />
        <AnimatedMain className="flex flex-col h-screen fixed w-full">
          <Header title="Receive Address" showBackButton={true} />
          <div className="flex items-center justify-center w-full h-full">
            <ReceiveLoading />
          </div>
        </AnimatedMain>
        <BottomNav />
      </>
    )
  }

  return (
    <>
      <TopNav />
      <AnimatedMain className="flex flex-col h-screen fixed w-full">
        <Header title="Receive Address" showBackButton={true} />
        <div className="pb-20 flex flex-col items-center justify-center relative w-full">
          <div className="p-2 bg-white rounded-lg">
            <QRCode style={{ height: '150px', width: '150px' }} value={receiveAddress} />
          </div>

          <h1 className="py-3 font-semibold text-base text-primarytext text-center">Your Kaspa Address</h1>
          <div className="pb-2 px-4 w-full flex justify-center">
            <KaspaAddress address={receiveAddress} />
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
