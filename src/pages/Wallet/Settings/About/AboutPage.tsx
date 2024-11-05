import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import ghostIcon from '../../../../../assets/ghost.svg'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export default function AboutPage() {
  const openWebsite = () => {
    window.open('https://ghostapp.org', '_blank')
  }

  return (
    <>
      <AnimatedMain>
        <Header title="About Ghost" showBackButton={true} />
        <div className="pt-8 px-4">
          <h1 className="text-primarytext text-4xl rubik font-bold text-center flex items-center justify-center space-x-2">
            <img className="w-12 h-12 inline-block" src={ghostIcon} alt="logo" />
            <span>GHOST</span>
          </h1>
          <p className="text-center text-base text-mutedtext pt-2 pb-6">Version {__APP_VERSION__}</p>
          <SettingsButton
            RightSideIcon={ArrowTopRightOnSquareIcon}
            text="Visit Website"
            onClick={openWebsite}
          />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
