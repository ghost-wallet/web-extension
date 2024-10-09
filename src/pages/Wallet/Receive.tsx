import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import useKaspa from '@/hooks/useKaspa'
import QRCode from 'react-qr-code'

export default function Receive() {
  const navigate = useNavigate()
  const { kaspa } = useKaspa()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const address = kaspa.addresses[0][kaspa.addresses[0].length - 1]
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1000) // Reset after 2 seconds
    })
  }

  return (
    <>
      <AnimatedMain>
        <div className="flex items-center justify-between mb-4 p-6">
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

        <div className="flex flex-col items-center relative">
          <div className="flex items-center">
            <textarea
              readOnly
              value={kaspa.addresses[0][kaspa.addresses[0].length - 1]}
              className="w-72 border-none resize-none text-base text-mutedtext bg-transparent"
            />
            <div className="relative ml-2">
              <button
                onClick={handleCopy}
                className="text-mutedtext hover:text-primarytext transition"
              >
                {copied ? (
                  <CheckIcon className="h-6 w-6 text-success" />
                ) : (
                  <DocumentDuplicateIcon className="h-6 w-6" />
                )}
              </button>
              {copied && (
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 p-0.5 text-xs text-mutedtext bg-bgdarker p-1 rounded">
                  Copied
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-16">
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
