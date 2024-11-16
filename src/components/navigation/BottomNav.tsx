import React from 'react'
import BottomNavButton from './BottomNavButton'
import { HomeIcon, ArrowsRightLeftIcon, BoltIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import BottomFixedContainer from '@/components/containers/BottomFixedContainer'

export default function BottomNav() {
  return (
    <BottomFixedContainer className="px-4 pb-4 bg-bgdark border-t border-darkmuted ">
      <div className="relative flex justify-around">
        <BottomNavButton icon={HomeIcon} path="/wallet" />
        <BottomNavButton icon={ArrowsRightLeftIcon} path="/swap" />
        <BottomNavButton icon={BoltIcon} path="/mint" />
        <BottomNavButton icon={DocumentTextIcon} path={['/transactions/kaspa', '/transactions/krc20']} />
      </div>
    </BottomFixedContainer>
  )
}
