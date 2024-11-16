import React from 'react'
import { useLocation } from 'react-router-dom'
import ConfirmationPage from '@/components/ConfirmationPage'
import CryptoImage from '@/components/CryptoImage'
import { getKaspaExplorerAddressUrl } from '@/utils/transactions'
import { MESSAGES } from '@/utils/constants/messages'

const Minted: React.FC = () => {
  const location = useLocation()
  const { token, receiveAmount, payAmount, scriptAddress } = location.state || {}

  return (
    <ConfirmationPage title={`${receiveAmount?.toLocaleString()} ${token.tick} is being minted!`}>
      <CryptoImage ticker={token.tick} size="large" />
      <p
        className="text-base text-mutedtext text-center pt-4"
        dangerouslySetInnerHTML={{
          __html: MESSAGES.MINT_SUCCESS(payAmount, getKaspaExplorerAddressUrl(scriptAddress)),
        }}
      />
    </ConfirmationPage>
  )
}

export default Minted
