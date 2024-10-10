import React from 'react'
import { currencies } from '@/contexts/Settings'
import useSettings from '@/hooks/useSettings'

const Currency: React.FC = () => {
  const { settings, updateSetting } = useSettings()

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting('currency', event.target.value as never)
  }

  return (
    <div>
      <h2 className="text-primarytext text-base font-lato mb-2 mt-6">Currency</h2>
      <div className="flex gap-1 mx-1 mb-4">
        <select
          value={settings.currency}
          onChange={handleCurrencyChange}
          className="w-full py-2 px-2 border rounded border-muted bg-bgdarker text-base text-primarytext cursor-pointer"
        >
          {Object.keys(currencies).map((currency) => (
            <option key={currency} value={currency}>
              {currency} ({currencies[currency as never]})
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Currency
