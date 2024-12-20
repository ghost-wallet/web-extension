import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import ghostIcon from '../../../../../assets/ghost.svg'
import SettingsButton from '@/pages/Wallet/Settings/SettingsButton'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export default function AboutPage() {
  const openGhostWalletSite = () => {
    window.open('https://ghostwallet.org', '_blank')
  }
  const openCMCSite = () => {
    window.open('https://coinmarketcap.com', '_blank')
  }
  const openGeckoSite = () => {
    window.open('https://coingecko.com', '_blank')
  }
  const openKasFyiSite = () => {
    window.open('https://kas.fyi', '_blank')
  }

  return (
    <>
      <AnimatedMain className="pt-5">
        <Header title="About Ghost" showBackButton={true} />
        <div className="pt-8 px-4">
          <h1 className="text-primarytext text-4xl rubik font-bold text-center flex items-center justify-center space-x-2">
            <img className="w-12 h-12 inline-block" src={ghostIcon} alt="logo" />
            <span>GHOST</span>
          </h1>
          <p className="text-center text-base text-mutedtext pt-2 pb-6">Version {__APP_VERSION__}</p>
          <SettingsButton
            RightSideIcon={ArrowTopRightOnSquareIcon}
            text="Ghost Wallet"
            onClick={openGhostWalletSite}
          />
          <h1 className="text-primarytext text-xl text-center flex items-center justify-center py-4">
            <span>Data provided by</span>
          </h1>
          <div className="space-y-2">
            <SettingsButton
              RightSideIcon={ArrowTopRightOnSquareIcon}
              text="CoinMarketCap"
              onClick={openCMCSite}
            />
            <SettingsButton
              RightSideIcon={ArrowTopRightOnSquareIcon}
              text="CoinGecko"
              onClick={openGeckoSite}
            />
            <SettingsButton
              RightSideIcon={ArrowTopRightOnSquareIcon}
              text="Kas.fyi"
              onClick={openKasFyiSite}
            />
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
