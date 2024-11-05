import Wallet from './kaspa/Wallet'
import Node from './kaspa/Node'
import AccountManager from './kaspa/account/AccountManager'
import RPC from './messaging/RPC'

import load, { initConsolePanicHook, version } from '@/wasm'

console.log('[Main] Starting WASM load...')
load().then(() => {
  initConsolePanicHook()

  console.log(`[Main] Kaspa WASM version ${version()}`)

  const wallet = new Wallet(() => {
    const node = new Node()
    const account = new AccountManager(node)

    const messaging = new RPC({ wallet, node, account })
  })
})
