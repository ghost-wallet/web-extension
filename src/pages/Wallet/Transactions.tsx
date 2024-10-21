import React, { useEffect, useState, useRef } from 'react'
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
  const [loadingMore, setLoadingMore] = useState(false)
  const lastElementRef = useRef<HTMLLIElement | null>(null) // Reference for the last transaction

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

  // Load more transactions automatically when the last element becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const lastEntry = entries[0]
        if (lastEntry.isIntersecting && kasplex.operations.next && !loadingMore) {
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
      },
      { threshold: 1.0 },
    )

    if (lastElementRef.current) {
      observer.observe(lastElementRef.current)
    }

    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current)
      }
    }
  }, [kasplex.operations.next, loadingMore, loadOperations])

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
              {kasplex.operations.result.map((operation, index) => {
                const isLastElement = index === kasplex.operations.result.length - 1
                return (
                  <li
                    key={operation.hashRev}
                    ref={isLastElement ? lastElementRef : null} // Assign the ref to the last element
                    className="p-4 bg-darkmuted rounded-lg shadow-md"
                  >
                    <p className="text-base font-lato text-mutedtext">
                      {new Date(parseInt(operation.mtsAdd)).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-base font-lato text-primarytext">
                      {operation.op} of {parseInt(operation.amt, 10) / 1e8} {operation.tick}
                    </p>
                    <a
                      href={`https://explorer.kaspa.org/txs/${operation.hashRev}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-lato text-base hover:underline"
                    >
                      View Transaction
                    </a>
                  </li>
                )
              })}
            </ul>

            {loadingMore && (
              <div className="flex justify-center mt-6 mb-20">
                <Spinner />
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
