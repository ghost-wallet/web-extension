import React from 'react'
import BottomNavButton from './BottomNavButton'
import { HomeIcon, ArrowsRightLeftIcon, BoltIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 w-full bg-bgdark border-t border-darkmuted px-4 pb-4"
      style={{ boxShadow: '0 -10px 15px rgba(0, 0, 0, 0.3)' }}
    >
      <div className="relative flex justify-around">
        <BottomNavButton icon={HomeIcon} path="/wallet" />
        <BottomNavButton icon={ArrowsRightLeftIcon} path="/swap" />
        <BottomNavButton icon={BoltIcon} path="/mint" />
        <BottomNavButton icon={DocumentTextIcon} path={['/transactions/kaspa', '/transactions/krc20']} />
      </div>
    </nav>
  )
}
