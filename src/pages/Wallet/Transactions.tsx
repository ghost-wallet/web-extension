import React, { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import useKaspa from '@/hooks/useKaspa'
import AnimatedMain from '@/components/AnimatedMain'
import Header from '@/components/Header'
import useKasplex from '@/hooks/useKasplex'
import Spinner from '@/components/Spinner'
import ErrorMessage from '@/components/ErrorMessage'

export default function Transactions() {
  const { kaspa } = useKaspa()
  const { kasplex, loadOperations } = useKasplex()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false) // State for loading more transactions

  useEffect(() => {
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
  }, [loadOperations])

  // Load more transactions when the "Load More" button is clicked
  const handleLoadMore = async () => {
    if (kasplex.operations.next) {
      setLoadingMore(true)
      try {
        await loadOperations(undefined, kasplex.operations.next) // Load more using the next cursor
      } catch (err) {
        console.error('Error loading more operations:', err)
        setError('Error loading more operations')
      } finally {
        setLoadingMore(false)
      }
    }
  }

  return (
    <>
      <AnimatedMain>
        <Header title="Recent Activity" showBackButton={false} />

        <div className="pt-6 text-center">
          <a
            href={`https://explorer.kaspa.org/addresses/${kaspa.addresses[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 text-lg font-lato text-primary hover:underline"
          >
            View on Kaspa Explorer
          </a>
        </div>

        {loading && (
          <div className="mt-10 flex justify-center">
            <Spinner />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {!loading && !error && kasplex.operations.result.length > 0 && (
          <div className="mt-10 px-4 pb-24">
            <ul className="space-y-3">
              {kasplex.operations.result.map((operation) => (
                <li key={operation.hashRev} className="p-4 bg-darkmuted rounded-lg shadow-md">
                  <p className="font-bold text-primarytext">{operation.op}</p>
                  <p className="text-sm text-mutedtext">Amount: {parseInt(operation.amt, 10) / 1e8}</p>
                  <p className="text-sm text-mutedtext">From: {operation.from}</p>
                  <p className="text-sm text-mutedtext">To: {operation.to}</p>
                  <p className="text-sm text-mutedtext">
                    Timestamp: {new Date(parseInt(operation.mtsAdd)).toLocaleString()}
                  </p>
                  <a
                    href={`https://explorer.kaspa.org/txs/${operation.hashRev}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Transaction
                  </a>
                </li>
              ))}
            </ul>

            {kasplex.operations.next && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !error && kasplex.operations.result.length === 0 && (
          <p className="text-mutedtext mt-10 text-center">No recent activity found.</p>
        )}
      </AnimatedMain>
      <BottomNav />
    </>
  )
}
