import React from 'react'
import { Menu } from '@headlessui/react'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import useSettings from '@/hooks/contexts/useSettings'
import { currencies } from '@/contexts/settings/SettingsProvider'

export default function PreferencesPage() {
  const { settings, updateSetting } = useSettings()

  const handleCurrencyChange = (currency: keyof typeof currencies) => {
    updateSetting('currency', currency)
  }

  return (
    <>
      <AnimatedMain className="pt-5">
        <Header title="Preferences" showBackButton={true} />
        <div className="pt-8 px-4">
          <div className="mb-4">
            <label className="pb-2 block text-base text-mutedtext">Preferred Currency</label>
            <div className="relative inline-block text-left w-full">
              <Menu as="div" className="relative w-full">
                <Menu.Button className="w-full py-2 px-2 border rounded border-muted bg-bgdarker text-base text-primarytext cursor-pointer text-left">
                  {settings.currency}
                </Menu.Button>
                <Menu.Items
                  className="absolute mt-2 w-full rounded-md shadow-lg bg-bgdarker ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  {Object.keys(currencies).map((currencyCode) => (
                    <Menu.Item key={currencyCode}>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-primary text-secondarytext' : 'text-primarytext'
                          } group flex w-full items-center px-4 py-2 text-sm text-left`}
                          onClick={() => handleCurrencyChange(currencyCode as keyof typeof currencies)}
                        >
                          {currencyCode}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Menu>
            </div>
          </div>
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
