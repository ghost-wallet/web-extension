import React from 'react'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'
import useKaspa from '@/hooks/contexts/useKaspa'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import SearchWalletButton from '@/components/SearchWalletButton'
import ConnectingToNetwork from '@/components/ConnectingToNetwork'
import useAccountName from '@/hooks/wallet/useAccountName'

const TopNav: React.FC = () => {
  const { kaspa } = useKaspa()
  const navigate = useNavigate()
  const accountName = useAccountName() || 'Account 1'
  return (
    <>
      <nav className="fixed top-0 w-full bg-bgdark border-b border-slightmuted p-4 z-40">
        <div className="flex items-center justify-between">
          {/* Settings Button */}
          <button onClick={() => navigate('/settings')} className="flex items-center">
            <Cog6ToothIcon className="h-6 w-6 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
          </button>

          {/* Address or Connection Status */}
          <div className="flex-1 flex justify-left pl-3">
            {kaspa.connected ? (
              <TruncatedCopyAddress account={accountName} address={kaspa.addresses[0]} />
            ) : (
              <ConnectingToNetwork />
            )}
          </div>

          {/* Search Wallet Button and Side Panel Button */}
          <div className="flex items-center">
            <SearchWalletButton />
          </div>
        </div>
      </nav>

      {/* Placeholder for TopNav Height */}
      <div className="h-16" />
    </>
  )
}

export default TopNav
