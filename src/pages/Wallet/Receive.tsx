import React from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import useKaspa from '@/hooks/useKaspa'
import QRCode from 'react-qr-code'

export default function Receive() {
  const navigate = useNavigate()
  const { kaspa } = useKaspa()

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primarytext hover:text-mutedtext transition"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-primarytext text-3xl font-rubik text-center flex-grow">
            Receive
          </h1>
          <div className="w-6" />
          {/* This div is for spacing to balance the button */}
        </div>

        <div className="flex flex-col items-center">
          <textarea
            readOnly
            value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
            className="w-72 border-none resize-none text-mutedtext bg-transparent"
          />
        </div>

        <div className="flex flex-col items-center mt-4">
          <QRCode
            style={{ height: 'auto', width: '50%' }}
            value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
          />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
