import Wallet from './Wallet'
import Node from './Node'
import Account from '@/wallet/Account'
import RPC from './RPC'
import load, { initConsolePanicHook, version } from '@/wasm'

async function initializeApp() {
  try {
    // TODO: fix load() or initConsolePanicHook() throws error: Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
    console.log('[Main] Starting WASM load()...')
    await load()
    console.log('[Main] Starting WASM initConsolePanicHook()...')
    initConsolePanicHook()

    console.log(`[Main] Kaspa WASM version ${version()}`)
    const wallet = new Wallet(() => {
      const node = new Node()
      const account = new Account(node)
      const messaging = new RPC({ wallet, node, account })
    })
    console.log('[Main] App initialized successfully')
  } catch (error) {
    console.error('[Main] Error initializing app:', error)
  }
}

initializeApp()
