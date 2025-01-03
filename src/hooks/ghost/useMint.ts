import axios from 'axios'
import ErrorMessages from '@/utils/constants/errorMessages'

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
  try {
    const response = await axios.post('https://api.ghostwallet.org/v1/krc20/mint/request', mintRequest, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Mint API error:', error.response)
      const statusCode = error.response.status
      if (statusCode >= 500 && statusCode < 600) {
        throw new Error(ErrorMessages.MINT.SERVER_UNAVAILABLE)
      } else {
        const errorMessage = `${statusCode} ${error.response.statusText}`
        throw new Error(errorMessage)
      }
    } else {
      console.error(
        `Unexpected ${error.response.status} error ${error.response.statusText}:`,
        JSON.stringify(error),
      )
      throw new Error(`${error.response.status} ${error.response.statusText}`)
    }
  }
}
