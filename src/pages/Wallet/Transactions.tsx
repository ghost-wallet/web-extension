import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import BottomNav from '@/components/navigation/BottomNav'
import TransactionsTabs from './Transactions/TransactionsTabs'
import TopNav from '@/components/navigation/TopNav'

const Transactions: React.FC = () => {
  return (
    <>
      <TopNav />
      <AnimatedMain>
        <Header title="Recent Activity" showBackButton={false} />
        <div className="px-4">
          <TransactionsTabs />
        </div>
      </AnimatedMain>
      <BottomNav />
    </>
  )
}

export default Transactions
