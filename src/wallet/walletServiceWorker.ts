import Wallet from './Wallet'
import Node from './Node'
import Account from '@/wallet/Account'
import RPC from './RPC'

import load, { initConsolePanicHook, version } from '@/wasm'

console.log('[Main] Starting WASM load...')
load().then(() => {
  initConsolePanicHook()

  console.log(`[Main] Kaspa WASM version ${version()}`)

  const wallet = new Wallet(() => {
    const node = new Node()
    const account = new Account(node)

    const messaging = new RPC({ wallet, node, account })
  })
})
