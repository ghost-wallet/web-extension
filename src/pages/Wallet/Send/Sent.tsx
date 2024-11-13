import React from 'react'
import { useLocation } from 'react-router-dom'
import ConfirmationPage from '@/components/ConfirmationPage'
import KaspaAddress from '@/components/KaspaAddress'

const Sent: React.FC = () => {
  const location = useLocation()
  const { token, amount, recipient, txnId } = location.state || {}

  return (
    <ConfirmationPage title="Sent!">
      <a
        href={`https://explorer.kaspa.org/txs/${txnId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-bold text-lg hover:underline"
      >
        View transaction
      </a>
      <p className="text-base text-mutedtext p-4 text-center">
        {amount.toLocaleString()} {token.tick} was successfully sent to
      </p>
      <KaspaAddress address={recipient} />
    </ConfirmationPage>
  )
}

export default Sent
