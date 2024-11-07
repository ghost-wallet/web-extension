/**
 * Interface defining the structure for a mint request payload.
 * @property {string} tick - The token ticker symbol (e.g., 'NACHO').
 * @property {number} timesToMint - The number of times to mint the token, from 5-1000.
 * @property {string} address - The Kaspa address where the minted tokens will be sent.
 */
interface MintRequest {
  tick: string
  timesToMint: number
  address: string
}

/**
 * Function to post a mint request to the API.
 * @param {MintRequest} mintRequest - The payload containing minting details.
 * @returns {Promise<any>} - The API response if successful.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function postMint(mintRequest: MintRequest): Promise<any> {
  const response = await fetch('https://api.ghostwallet.org/v1/krc20/mint/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(mintRequest),
  })

  if (!response.ok) {
    console.error('Mint API error:', response)
    const errorMessage = `${response.status} ${response.statusText}`
    throw new Error(errorMessage)
  }

  return await response.json()
}
