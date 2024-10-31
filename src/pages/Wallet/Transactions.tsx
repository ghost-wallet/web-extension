import React from 'react'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import TransactionsTabs from './Transactions/TransactionsTabs'

const Transactions: React.FC = () => {
  return (
    <>
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
