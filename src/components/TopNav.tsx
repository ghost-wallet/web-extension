import React from 'react'
import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'
import useKaspa from '@/hooks/contexts/useKaspa'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import Spinner from '@/components/Spinner'
import useSettings from '@/hooks/contexts/useSettings'

const TopNav: React.FC = () => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const navigate = useNavigate()

  return (
    <>
      <nav className="fixed top-0 w-full bg-bgdark border-b border-slightmuted p-4 z-40">
        <div className="flex items-center justify-between">
          {/* Left side - Settings button */}
          <button onClick={() => navigate('/settings')} className="flex items-center">
            <Cog6ToothIcon className="h-7 w-7 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
          </button>

          {/* Center - TruncatedCopyAddress or Spinner if not connected */}
          <div className="flex-1 flex justify-center">
            {!kaspa.connected ? (
              <div className="flex items-center bg-darkmuted text-primarytext text-sm p-1 rounded">
                <p className="px-2">{`Connecting to ${settings.nodes[settings.selectedNode].address}...`}</p>
                <div className="p-1">
                  <Spinner size="small" />
                </div>
              </div>
            ) : (
              <TruncatedCopyAddress account="Account 1" address={kaspa.addresses[0]} />
            )}
          </div>

          {/* Right side - Spacer to keep layout balanced */}
          <div className="w-7" />
        </div>
      </nav>

      {/* Placeholder to take up the TopNav height */}
      <div className="h-16" />
    </>
  )
}

export default TopNav
