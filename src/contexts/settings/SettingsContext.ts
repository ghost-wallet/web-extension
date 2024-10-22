import { createContext } from 'react'
import { ISettings } from './SettingsProvider'

export const SettingsContext = createContext<
  | {
      load: () => Promise<void>
      settings: ISettings
      updateSetting: <K extends keyof ISettings>(key: K, value: ISettings[K]) => void
    }
  | undefined
>(undefined)
