import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import ResetWalletButton from '@/components/buttons/ResetWalletButton'

const ConfirmReset: React.FC = () => {
  return (
    <>
      <AnimatedMain>
        <Header title="Reset Wallet" showBackButton={true} />
        <div className="px-6">
          <p className="text-warning text-base text-center pt-6 pb-10">
            Are you sure you want to reset your Ghost extension? This action cannot be undone and will erase
            all your data. The only way to regain access to your wallet is with your 12-word or 24-word secret
            recovery phrase. It's not necessary to remember your password, as you will be prompted to create a
            new one.
          </p>
          <ResetWalletButton />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default ConfirmReset
