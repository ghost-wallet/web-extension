import React, { useState } from 'react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/BottomNav'
import useKaspa from '@/hooks/useKaspa'
import { useNavigate } from 'react-router-dom'

const ConfirmReset: React.FC = () => {
  const { request } = useKaspa()
  const navigate = useNavigate()

  const [isChecked, setIsChecked] = useState(false)

  const handleConfirm = async () => {
    await request('wallet:reset', [])
    navigate('/')
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Reset Wallet" showBackButton={true} />
        <div className="px-6">
          <p className="text-warning text-base font-lato text-center pt-6 mb-6">
            Are you sure you want to reset your Ghost extension? This action cannot be undone and will erase
            all your data. The only way to regain access to your wallet is with your 12-word or 24-word secret
            recovery phrase. It's not necessary to remember your password, as you will be prompted to create a
            new one.
          </p>

          <div className="flex gap-3 justify-start items-center mt-8 mb-8">
            <input
              type="checkbox"
              id="reset-confirmation"
              className="cursor-pointer transform scale-150"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="reset-confirmation" className="text-mutedtext text-base font-lato">
              I have direct access to my 12-word or 24-word secret recovery phrase.
            </label>
          </div>

          <div className="fixed bottom-0 left-0 w-full px-6 pb-20">
            <button
              type="button"
              disabled={!isChecked}
              onClick={handleConfirm}
              className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] ${
                isChecked
                  ? 'bg-error text-secondarytext cursor-pointer hover:bg-hover'
                  : 'bg-slightmuted text-secondarytext cursor-default'
              }`}
            >
              Reset wallet and delete all my data
            </button>
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default ConfirmReset
