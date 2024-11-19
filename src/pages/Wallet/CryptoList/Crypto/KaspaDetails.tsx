import React from 'react'
import useKaspaPrice from '@/hooks/kaspa/useKaspaPrice'
import useSettings from '@/hooks/contexts/useSettings'
import { getCurrencySymbol } from '@/utils/currencies'
import TableSection from '@/components/table/TableSection'
import TokenPrice from '@/components/TokenPrice'
import useKaspa from '@/hooks/contexts/useKaspa'
import KaspaTxnHistory from '@/pages/Wallet/Transactions/KaspaTxnHistory'
import KaspaTxnHistoryTestnet from '@/pages/Wallet/Transactions/KaspaTxnHistoryTestnet'

const KaspaDetails: React.FC = () => {
  const { settings } = useSettings()
  const { kaspa } = useKaspa()
  const kaspaPrice = useKaspaPrice(settings.currency)
  const currencySymbol = getCurrencySymbol(settings.currency)
  const network = settings.nodes[settings.selectedNode].address

  const currencyValue = kaspa.balance * kaspaPrice.data!
  const formattedCurrencyValue = currencyValue.toLocaleString(undefined, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="p-4">
      <TableSection
        title="Your Balance"
        rows={[
          {
            label: settings.currency,
            value: kaspaPrice.isPending ? 'Loading...' : `${formattedCurrencyValue}`,
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
        className="mt-6 mb-6"
      />
      {network === 'mainnet' ? <KaspaTxnHistory /> : <KaspaTxnHistoryTestnet />}
    </div>
  )
}

export default KaspaDetails
