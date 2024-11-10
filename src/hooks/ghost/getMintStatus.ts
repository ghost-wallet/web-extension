import axios from 'axios'

/**
 * Function to get the status of a mint request.
 * @param {string} scriptAddress - The Kaspa script address used for the minting.
 * @returns {Promise<any>} - The API response with the mint status if successful.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function getMintStatus(scriptAddress: string): Promise<any> {
  try {
    const baseURL = 'http://localhost:3000'
    const url = `${baseURL}/v1/krc20/mint/status?script_address=${encodeURIComponent(scriptAddress)}`
    console.log('Fetching mint status from URL:', url)

    // Make GET request to fetch mint status
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Mint Status API error:', error.response)
      const statusCode = error.response.status
      if (statusCode >= 500 && statusCode < 600) {
        throw new Error('Ghost server unavailable. Try again later or check a different token status.')
      } else {
        const errorMessage = `${statusCode} ${error.response.statusText}`
        throw new Error(errorMessage)
      }
    } else {
      console.error('Unexpected error:', error)
      throw new Error('An unexpected error occurred.')
    }
  }
}
