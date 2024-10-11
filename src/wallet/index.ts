import Wallet from './kaspa/wallet'
import Node from './kaspa/node'
import Account from './kaspa/account'
import RPC from './messaging'

import load, { initConsolePanicHook } from '@/wasm'

console.log('[Main] Starting WASM load...')
load()
  .then(() => {
    console.log('[Main] WASM loaded successfully.')
    initConsolePanicHook()

    const wallet = new Wallet(async () => {
      try {
        const node = new Node()
        const account = new Account(node)
        const messaging = new RPC({ wallet, node, account })
      } catch (error) {
        console.error('[Main] Error initializing components:', error)
      }
    })
  })
  .catch((error) => {
    console.error('[Main] Error loading WASM:', error)
  })
