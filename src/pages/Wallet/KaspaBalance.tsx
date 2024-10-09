import React from 'react'
import useKaspa from '@/hooks/useKaspa'
import useSettings from '@/hooks/useSettings'
import useCoingecko from '@/hooks/useCoingecko'

const KaspaBalance: React.FC = () => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const price = useCoingecko(settings.currency)

  return (
    <>
      <p className="text-3xl font-rubik text-primarytext">
        {kaspa.balance !== null && kaspa.balance !== undefined
          ? `${kaspa.balance.toFixed(2)} KAS`
          : 'Loading...'}
      </p>
      <p className="text-xl font-rubik text-primarytext">
        {settings.currency === 'USD'
          ? '$'
          : settings.currency === 'EUR'
            ? '€'
            : settings.currency}{' '}
        {(kaspa.balance * price).toFixed(2)}
      </p>
    </>
  )
}

export default KaspaBalance
