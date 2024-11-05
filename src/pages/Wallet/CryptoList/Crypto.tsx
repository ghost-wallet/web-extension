import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import AnimatedMain from '@/components/AnimatedMain'
import BottomNav from '@/components/navigation/BottomNav'
import CryptoImage from '@/components/CryptoImage'
import ActionButtons from '@/pages/Wallet/CryptoList/Crypto/ActionButtons'
import KRC20Details from '@/pages/Wallet/CryptoList/Crypto/KRC20Details'
import KaspaDetails from './Crypto/KaspaDetails'
import TopNav from '@/components/navigation/TopNav'

const Crypto: React.FC = () => {
  const location = useLocation()
  const { token } = location.state || {}

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <TopNav />
      <AnimatedMain>
        <Header title={token.tick} showBackButton={true} />
        <CryptoImage ticker={token.tick} size={'large'} />
        <ActionButtons token={token} />
        {token.isKaspa ? <KaspaDetails /> : <KRC20Details token={token}></KRC20Details>}
      </AnimatedMain>

      <BottomNav />
    </>
  )
}

export default Crypto
