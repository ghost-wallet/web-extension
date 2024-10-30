import React from 'react'
import useKaspaPrice from '@/hooks/useKaspaPrice'
import useSettings from '@/hooks/contexts/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'
import TableSection from '@/components/table/TableSection'
import TokenPrice from '@/components/TokenPrice'
import useKaspa from '@/hooks/contexts/useKaspa'

const KaspaDetails: React.FC = () => {
  const { settings } = useSettings()
  const { kaspa } = useKaspa()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const currencySymbol = getCurrencySymbol(settings.currency)

  return (
    <div className="p-4">
      <TableSection
        title="Your Balance"
        rows={[
          {
            label: settings.currency,
            value: kaspaPrice.isPending
              ? 'Loading...'
              : `${currencySymbol}${(kaspa.balance *  kaspaPrice.data!).toFixed(2)}`,
          },
          {
            label: 'KASPA',
            value: kaspa.balance,
          },
        ]}
      />

      <TableSection
        title="Market Details"
        rows={[
          {
            label: `${settings.currency} Price`,
            value: kaspaPrice.isPending ? (
              'Loading...'
            ) : (
              <TokenPrice value={`${currencySymbol}${kaspaPrice.data}`} />
            ),
          },
        ]}
        className="mt-6 mb-2"
      />
    </div>
  )
}

export default KaspaDetails
