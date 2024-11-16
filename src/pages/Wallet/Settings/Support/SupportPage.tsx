import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import WarningMessage from '@/components/WarningMessage'
import { WarningMessages } from '@/utils/constants/warningMessages'

export default function SupportPage() {
  const openWebsite = () => {
    window.open('https://discord.gg/ghostwallet', '_blank')
  }

  return (
    <>
      <AnimatedMain className="pt-5">
        <Header title="Help & Support" showBackButton={true} />
        <div className="pt-2 px-4">
          <p className="text-center text-base text-mutedtext pt-2 pb-4">
            Contact the Ghost support team on our Discord.
          </p>
          <div className="pb-4">
            <SettingsButton
              RightSideIcon={ArrowTopRightOnSquareIcon}
              text="Join Discord server"
              onClick={openWebsite}
            />
          </div>
          <WarningMessage message={WarningMessages.CUSTOMER_SUPPORT} />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
