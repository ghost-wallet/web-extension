import React, { useState } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import SearchWalletResults from '@/components/search/SearchWalletResults'

const SearchWalletButton: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false)

  const handleSearchToggle = () => setShowSearch(!showSearch)

  return (
    <>
      {/* Search Button Icon */}
      <button onClick={handleSearchToggle} className="flex items-center">
        <MagnifyingGlassIcon className="h-6 w-6 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
      </button>

      {/* Search Wallet Overlay */}
      {showSearch && (
        <motion.div
          className="fixed inset-0 z-50 bg-bgdark bg-opacity-90 p-4 overflow-y-auto"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-end items-center mb-4">
            <button onClick={handleSearchToggle} className="text-white" aria-label="Close search">
              <XMarkIcon className="h-7 w-7 transform transition-transform duration-300 hover:scale-125 text-mutedtext" />
            </button>
          </div>
          <SearchWalletResults />
        </motion.div>
      )}
    </>
  )
}

export default SearchWalletButton
