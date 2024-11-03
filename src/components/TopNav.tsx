import TruncatedCopyAddress from '@/components/TruncatedCopyAddress'
import useKaspa from '@/hooks/contexts/useKaspa'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'

export default function TopNav() {
  const { kaspa } = useKaspa()
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 w-full bg-bgdark border-b border-slightmuted p-4 z-40">
      <div className="flex items-center justify-between">
        {/* Left side - Settings button */}
        <button onClick={() => navigate('/settings')} className="flex items-center">
          <Cog6ToothIcon className="h-7 w-7 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
        </button>

        {/* Center - TruncatedCopyAddress */}
        <div className="flex-1 flex justify-center">
          <TruncatedCopyAddress account="Account 1" address={kaspa.addresses[0]} />
        </div>

        {/* Right side - Spacer to keep layout balanced */}
        <div className="w-7" />
      </div>
    </nav>
  )
}
