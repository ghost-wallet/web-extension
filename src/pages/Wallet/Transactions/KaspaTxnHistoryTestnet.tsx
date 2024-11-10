import React from 'react'
import useSettings from '@/hooks/contexts/useSettings'
import useKaspa from '@/hooks/contexts/useKaspa'

const KaspaTxnHistoryTestnet: React.FC = () => {
  const { kaspa } = useKaspa()
  const { settings } = useSettings()
  const network = settings.nodes[settings.selectedNode].address
  const address = kaspa.addresses[0]

  if (!address) {
    return <p className="text-mutedtext text-center text-base">No address available</p>
  }

  let explorerUrl = ''
  if (network === 'testnet-10') {
    explorerUrl = `https://explorer-tn10.kaspa.org/addresses/${address}`
  } else if (network === 'testnet-11') {
    explorerUrl = `https://explorer-tn11.kaspa.org/addresses/${address}`
  } else {
    return null
  }

  return (
    <div className="mt-10 flex justify-center pb-20">
      <p className="text-mutedtext text-center text-base">
        View on{' '}
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Kaspa Testnet Explorer
        </a>
        .
      </p>
    </div>
  )
}

export default KaspaTxnHistoryTestnet
