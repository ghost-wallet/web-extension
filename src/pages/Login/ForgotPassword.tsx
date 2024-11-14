import React from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import ResetWalletButton from '@/components/buttons/ResetWalletButton'
import { WarningMessages } from '@/utils/constants/warningMessages'
import WarningMessage from '@/components/WarningMessage'

const ForgotPassword: React.FC = () => {
  return (
    <>
      <AnimatedMain className="flex flex-col h-screen w-full pt-5 justify-between">
        <div>
          <Header title="Forgot Password" showBackButton={true} />
          <div className="px-4 pt-6">
            <WarningMessage message={WarningMessages.FORGOT_PASSWORD} />
          </div>
        </div>
        <div className="p-4">
          <ResetWalletButton />
        </div>
      </AnimatedMain>
    </>
  )
}

export default ForgotPassword
