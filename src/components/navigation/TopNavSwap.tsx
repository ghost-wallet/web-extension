import React, { useState } from 'react'
import useKaspa from '@/hooks/contexts/useKaspa'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import ConnectingToNetwork from '@/components/ConnectingToNetwork'
import TruncatedCopyAccountName from '@/components/TruncatedCopyAccountName'
import SlippageButton from '@/pages/Wallet/Swap/SlippageButton'
import { AnimatePresence } from 'framer-motion'
import SlippageSettings from '@/pages/Wallet/Swap/SlippageSettings'

interface TopNavSwapProps {
  slippage: number
  setSlippage: (selectedSlippage: number) => void
}

const TopNavSwap: React.FC<TopNavSwapProps> = ({ slippage, setSlippage }) => {
  const { kaspa } = useKaspa()
  const navigate = useNavigate()
  const [isSlippageOpen, setIsSlippageOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 w-full bg-bgdark border-b border-slightmuted p-4 z-40">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/settings')} className="flex items-center">
            <Cog6ToothIcon className="h-6 w-6 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
          </button>

          <div className="flex-1 flex justify-left pl-3">
            {kaspa.connected ? (
              <TruncatedCopyAccountName address={kaspa.addresses[0]} />
            ) : (
              <ConnectingToNetwork />
            )}
          </div>

          <div className="flex items-center">
            <SlippageButton setIsSlippageOpen={setIsSlippageOpen} slippage={slippage} />
          </div>
        </div>
      </nav>

      <div className="h-14" />

      <AnimatePresence>
        {isSlippageOpen && (
          <SlippageSettings
            onClose={() => setIsSlippageOpen(false)}
            onSelectSlippage={setSlippage}
            slippage={slippage}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default TopNavSwap
