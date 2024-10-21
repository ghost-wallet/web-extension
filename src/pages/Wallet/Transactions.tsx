import React, { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import TransactionList from '@/pages/Wallet/Transactions/TransactionList'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'
import useKasplex from '@/hooks/useKasplex'

export default function Transactions() {
  const { kasplex, loadOperations } = useKasplex()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!kasplex.operations.result.length) {
      const fetchOperations = async () => {
        setLoading(true)
        try {
          await loadOperations()
        } catch (err) {
          console.error(err)
          setError('Error loading operations')
        } finally {
          setLoading(false)
        }
      }

      fetchOperations()
    }
  }, [loadOperations, kasplex.operations.result.length])

  return (
    <>
      <AnimatedMain>
        <Header title="Recent Activity" showBackButton={false} />

        {loading && (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && kasplex.operations.result.length > 0 && <TransactionList />}

        {!loading && !error && kasplex.operations.result.length === 0 && (
          <p className="text-mutedtext mt-10 text-center">No recent activity found.</p>
        )}
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
