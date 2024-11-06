import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import ResetWalletButton from '@/components/buttons/ResetWalletButton'
import { WarningMessages } from '@/utils/constants/warningMessages'

const ConfirmReset: React.FC = () => {
  return (
    <>
      <AnimatedMain>
        <Header title="Reset Wallet" showBackButton={true} />
        <div className="px-6">
          <p className="text-warning text-base text-justify pt-6 pb-10">{WarningMessages.RESET_WALLET}</p>
          <ResetWalletButton />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default ConfirmReset
