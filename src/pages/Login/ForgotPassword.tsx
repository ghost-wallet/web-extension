import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import ResetWalletButton from '@/components/buttons/ResetWalletButton'

const ForgotPassword: React.FC = () => {
  return (
    <>
      <AnimatedMain>
        <Header title="Forgot Password" showBackButton={true} />
        <div className="px-6">
          <p className="text-warning text-base font-lato text-center pt-6 pb-32">
            The only way to reset your password is by resetting your wallet. You can re-import your wallet
            with your 12-word or 24-word secret phrase.
          </p>
          <ResetWalletButton />
        </div>
      </AnimatedMain>
    </>
  )
}

export default ForgotPassword
