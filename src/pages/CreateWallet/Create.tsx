import { useState } from 'react'

export default function Create({
                                 mnemonic,
                                 onSaved,
                               }: {
  mnemonic: string
  onSaved: () => void
}) {
  const [isSaved, setIsSaved] = useState(false)
  const [isHidden, setIsHidden] = useState(true)

  return (
    <main className="flex flex-col justify-between min-h-screen py-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Backup Wallet</h1>
        <p className="text-base mt-2">Backup your mnemonic securely</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="border-2 p-3 mx-5 rounded-xl">
          <p className="text-xl font-mono">
            {isHidden ? mnemonic.replace(/[^ ]/g, '*') : mnemonic}
          </p>
        </div>
        <button
          className="flex items-center gap-1 text-blue-500 hover:underline"
          onClick={() => {
            setIsHidden(!isHidden)
          }}
        >
          {isHidden ? 'Show' : 'Hide'}
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center space-x-2">
          <input
            id="savedConfirmation"
            type="checkbox"
            className="cursor-pointer"
            onChange={(e) => setIsSaved(e.target.checked)}
          />
          <label
            htmlFor="savedConfirmation"
            className="text-sm font-medium"
          >
            I confirm I have backed up my mnemonic.
          </label>
        </div>
        <button
          className={`flex items-center gap-1 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg ${!isSaved ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isSaved}
          onClick={onSaved}
        >
          <span>Finish</span>
        </button>
      </div>
    </main>
  )
}
