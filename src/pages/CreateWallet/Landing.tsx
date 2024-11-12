import React, { useState } from 'react'
import { Tabs } from '../CreateWallet'
import AnimatedMain from '@/components/AnimatedMain'
import AnimatedGhostLogo from '@/components/AnimatedGhostLogo'
import Checkbox from '@/components/Checkbox'

export default function Landing({
  forward,
}: {
  forward: (tab: Tabs, flowType: 'create' | 'import') => void
}) {
  const [enable, setEnable] = useState<boolean>(false)

  return (
    <AnimatedMain className="pt-10 px-4 overflow-y-scroll h-full">
      <h1 className="text-primarytext text-4xl font-rubik font-bold text-center">GHOST</h1>
      <p className="text-mutedtext text-base text-center mt-2">Secure Kaspa wallet for KRC20 tokens.</p>
      <div className="flex justify-center mt-20 mb-8">
        <AnimatedGhostLogo />
      </div>
      <div className="flex gap-3 justify-center items-center mb-4">
        <Checkbox checked={enable} onChange={setEnable} />
        <p className="text-primarytext text-base">
          I agree to Ghost’s{' '}
          <span className="text-primary text-base font-semibold hover:underline">
            <a href="https://www.ghostapp.org/terms-of-service" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
          </span>
          .
        </p>
      </div>
      <div className="w-full pb-10 flex flex-col gap-3 mt-auto">
        <button
          onClick={() => {
            forward(Tabs.Password, 'create')
          }}
          disabled={!enable}
          className={`w-full h-[3.25rem] text-base font-semibold rounded-full transition-colors duration-300 ${
            enable
              ? 'bg-primary text-secondarytext hover:bg-hoverprimary cursor-pointer'
              : 'bg-secondary text-secondarytext cursor-default'
          }`}
        >
          Create Wallet
        </button>
        <button
          onClick={() => {
            forward(Tabs.Password, 'import')
          }}
          disabled={!enable}
          className={`w-full h-[3.25rem] text-base font-semibold border border-primary rounded-full transition-colors duration-300 ${
            enable
              ? 'text-primary cursor-pointer hover:border-hover'
              : 'border-secondary text-secondary cursor-default'
          }`}
        >
          Import Wallet
        </button>
      </div>
    </AnimatedMain>
  )
}
