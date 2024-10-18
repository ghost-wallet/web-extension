import useKaspa from '@/hooks/useKaspa'
import React, { useState } from 'react'

export default function Reset() {
  const { request } = useKaspa()
  const [showPopup, setShowPopup] = useState(false)

  const handleReset = async () => {
    await request('wallet:reset', [])
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="bg-error hover:bg-errormuted text-secondarytext text-base font-semibold font-lato w-[240px] py-3 rounded-[25px]"
        onClick={() => setShowPopup(true)}
      >
        Reset wallet
      </button>

      {showPopup && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-black p-6 z-50">
          <p className="text-center mb-2">Are you sure you want to reset your Ghost extension?</p>
          <p className="text-center mb-4">
            This action cannot be undone and will erase all your data. The only way to restore a wallet is
            with a 12-word or 24-word recovery phrase.
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="bg-success text-primarytext text-lg font-lato w-full max-w-xs py-3 rounded-[25px]"
              onClick={handleReset}
            >
              Yes, Reset
            </button>
            <button
              className="bg-muted text-primarytext text-lg font-lato w-full max-w-xs py-3 rounded-[25px]"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
