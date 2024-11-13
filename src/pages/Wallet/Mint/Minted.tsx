import React from 'react'
import { useLocation } from 'react-router-dom'
import ConfirmationPage from '@/components/ConfirmationPage'
import CryptoImage from '@/components/CryptoImage'
import { getKaspaExplorerAddressUrl } from '@/utils/transactions'

const Minted: React.FC = () => {
  const location = useLocation()
  const { token, receiveAmount, payAmount, scriptAddress } = location.state || {}

  return (
    <ConfirmationPage title={`${receiveAmount?.toLocaleString()} ${token.tick} is being minted!`}>
      <CryptoImage ticker={token.tick} size="large" />
      <p className="text-base text-mutedtext text-center">
        Estimated time until completion:{' '}
        {(payAmount * 5.63) / 60 > 1
          ? `${((payAmount * 5.63 + 100) / 60).toFixed(2)} minutes`
          : 'Less than a minute'}
        . You can track progress on the{' '}
        <a
          href={getKaspaExplorerAddressUrl(scriptAddress)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Kaspa Explorer
        </a>
        .
      </p>
    </ConfirmationPage>
  )
}

export default Minted
