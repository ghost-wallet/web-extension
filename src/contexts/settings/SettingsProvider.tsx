import React, { useState, useEffect, useCallback, type ReactNode } from 'react'
import LocalStorage from '@/storage/LocalStorage'
import { SettingsContext } from './SettingsContext'

export interface ISettings {
  version: number
  theme: 'dark' | 'light' | 'system'
  currency: keyof typeof currencies
  nodes: {
    name: string
    address: string
    locked: boolean
  }[]
  selectedNode: number
}

export const currencies = {
  USD: 'USD', // US Dollar
  EUR: 'EUR', // Euro
  JPY: 'JPY', // Japanese Yen
  GBP: 'GBP', // British Pound
  AUD: 'AUD', // Australian Dollar
  CAD: 'CAD', // Canadian Dollar
  CHF: 'CHF', // Swiss Franc
  CNY: 'CNY', // Chinese Yuan
  SEK: 'SEK', // Swedish Krona
  NZD: 'NZD', // New Zealand Dollar
}

export const defaultSettings: ISettings = {
  version: 1,
  theme: 'system',
  currency: 'USD',
  nodes: [
    {
      name: 'Public node',
      address: 'mainnet',
      locked: true,
    },
    {
      name: 'Public node',
      address: 'testnet-10',
      locked: true,
    },
    {
      name: 'Public node',
      address: 'testnet-11',
      locked: true,
    },
  ],
  selectedNode: 0,
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    LocalStorage.set('settings', settings)
  }, [settings])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(settings.theme)
  }, [settings.theme])

  const load = useCallback(async () => {
    const storedSettings = await LocalStorage.get('settings', defaultSettings)
    if (!storedSettings || storedSettings.version !== defaultSettings.version) {
      setSettings(defaultSettings)
      return
    }
    setSettings(storedSettings)
  }, [])

  const updateSetting = useCallback(<K extends keyof ISettings>(key: K, value: ISettings[K]) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }))
  }, [])

  return (
    <SettingsContext.Provider value={{ load, settings, updateSetting }}>{children}</SettingsContext.Provider>
  )
}
