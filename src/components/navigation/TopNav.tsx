import React from 'react'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'
import useKaspa from '@/hooks/contexts/useKaspa'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Spinner from '@/components/loaders/Spinner'
import useSettings from '@/hooks/contexts/useSettings'
import SearchWalletButton from '@/components/SearchWalletButton'

const TopNav: React.FC = () => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const navigate = useNavigate()

  return (
    <>
      <nav className="fixed top-0 w-full bg-bgdark border-b border-slightmuted p-4 z-40">
        <div className="flex items-center justify-between">
          {/* Settings Button */}
          <button onClick={() => navigate('/settings')} className="flex items-center">
            <Cog6ToothIcon className="h-7 w-7 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
          </button>

          {/* Address or Connection Status */}
          <div className="flex-1 flex justify-left pl-3">
            {kaspa.connected ? (
              <TruncatedCopyAddress account="Account 1" address={kaspa.addresses[0]} />
            ) : (
              <div className="flex items-center bg-darkmuted text-primarytext text-sm p-1 rounded">
                <p className="px-2">{`Connecting to ${settings.nodes[settings.selectedNode].address}...`}</p>
                <div className="p-1">
                  <Spinner size="small" />
                </div>
              </div>
            )}
          </div>

          {/* Search Wallet Button */}
          <SearchWalletButton />
        </div>
      </nav>

      {/* Placeholder for TopNav Height */}
      <div className="h-16" />
    </>
  )
}

export default TopNav
