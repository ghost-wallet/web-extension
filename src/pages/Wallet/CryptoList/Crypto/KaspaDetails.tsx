import React from 'react'
import { useKaspaPrice } from '@/hooks/ghost/usePrice'
import useSettings from '@/hooks/contexts/useSettings'
import TableSection from '@/components/table/TableSection'
import TokenPrice from '@/components/TokenPrice'
import useKaspa from '@/hooks/contexts/useKaspa'
import KaspaTxnHistory from '@/pages/Wallet/Transactions/KaspaTxnHistory'
import KaspaTxnHistoryTestnet from '@/pages/Wallet/Transactions/KaspaTxnHistoryTestnet'
import { tokenPriceFormatter } from '@/utils/formatting'

const KaspaDetails: React.FC = () => {
  const { settings } = useSettings()
  const { kaspa } = useKaspa()
  const kaspaPrice = useKaspaPrice()
  const network = settings.nodes[settings.selectedNode].address

  const formattedTokenPrice = tokenPriceFormatter(kaspaPrice.data!)

  const currencyValue = kaspa.balance * kaspaPrice.data!
  const formattedCurrencyValue = currencyValue.toLocaleString(navigator.language, {
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
            value: kaspaPrice.isPending ? 'Loading...' : <TokenPrice value={`${formattedTokenPrice}`} />,
          },
        ]}
        className="mt-6 mb-6"
      />
      <h1 className="text-primarytext text-2xl font-rubik text-center pb-2">Recent Activity</h1>
      {network === 'mainnet' ? <KaspaTxnHistory /> : <KaspaTxnHistoryTestnet />}
    </div>
  )
}

export default KaspaDetails
