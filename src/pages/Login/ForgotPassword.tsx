import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import ResetWalletButton from '@/components/buttons/ResetWalletButton'
import { WarningMessages } from '@/utils/constants/warningMessages'

const ForgotPassword: React.FC = () => {
  return (
    <>
      <AnimatedMain>
        <Header title="Forgot Password" showBackButton={true} />
        <div className="px-6">
          <p className="text-warning text-base text-justify pt-6 pb-32">{WarningMessages.FORGOT_PASSWORD}</p>
          <ResetWalletButton />
        </div>
      </AnimatedMain>
    </>
  )
}

export default ForgotPassword
