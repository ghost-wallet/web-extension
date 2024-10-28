import Wallet from './kaspa/wallet'
import Node from './kaspa/node'
import Account from './kaspa/account/account'
import RPC from './messaging/rpc'

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
