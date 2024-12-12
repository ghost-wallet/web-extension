import { HexString } from '@/wasm'

export const postChaingeOrder = async (
  postBody: {
    walletAddress: string
    payTokenTicker: string
    payAmount: number
    receiveTokenTicker: string
    receiveAmount: number
    chaingeOrderId: string
    receiveAmountUsd: number
    slippage: string
    priceImpact: string
    gasFee: number
    serviceFeeUsd: number
    timestamp: number
  },
  signature: HexString,
  publicKey: string,
) => {
  const url = 'https://dev-api.ghostwallet.ninja/chainge/order'

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Signature ${signature}`,
    'Public-Key': publicKey,
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(postBody),
  })

  if (!response.ok) {
    throw new Error('Failed to post Chainge order: ' + response.statusText)
  }

  return
}
