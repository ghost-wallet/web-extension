export const postChaingeOrder = async (postBody: {
  walletAddress: string
  payTokenTicker: string
  payAmount: string
  receiveTokenTicker: string
  receiveAmount: string
  chaingeOrderId: string
  receiveAmountUsd: string
}) => {
  const url = 'https://dev-api.ghostwallet.ninja/chainge/order'

  console.log('posting request body:', postBody)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postBody),
  })
  console.log('post chainge order response:', response)

  if (!response.ok) {
    throw new Error('Failed to post Chainge order: ' + response.statusText)
  }

  return
}
