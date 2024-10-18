import React, { useState } from 'react'
import { Tabs } from '../CreateWallet'

export default function Landing({
  forward,
}: {
  forward: (tab: Tabs, flowType: 'create' | 'import') => void
}) {
  const [enable, setEnable] = useState<boolean>(false)

  return (
    <main className="pt-10 px-6">
      <h1 className="text-primarytext text-4xl rubik font-bold text-center">GHOST</h1>
      <p className="text-mutedtext text-base font-lato text-center mt-2">
        Secure Kaspa wallet for KRC20 tokens.
      </p>
      <div className="flex justify-center mt-7 mb-32">
        <img className="w-[123px] h-[123px]" src="favicon.png" alt="logo" />
      </div>
      <div className="flex gap-3 justify-center items-center">
        <input
          className="cursor-pointer transform scale-150"
          onClick={() => setEnable(!enable)}
          type="checkbox"
        />
        <p className="text-primarytext text-base font-lato">
          I agree to Ghost’s{' '}
          <span className="text-primary text-base font-lato font-semibold">
            <a href="https://www.ghostapp.org/terms-of-service" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
          </span>
          .
        </p>
      </div>
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10 flex flex-col gap-3">
        <button
          onClick={() => {
            forward(Tabs.Password, 'create')
          }}
          className={`w-full h-[52px] text-base font-lato font-semibold rounded-[25px] transition-colors duration-300 ${
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
          className={`w-full h-[52px] text-base font-lato font-semibold border-primary border rounded-[25px] ${
            enable
              ? 'text-primary cursor-pointer hover:border-hover'
              : 'border-secondary text-secondary cursor-default'
          }`}
        >
          Import Wallet
        </button>
      </div>
    </main>
  )
}
