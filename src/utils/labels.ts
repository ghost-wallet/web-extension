import { KRC20TokenResponse } from './interfaces'

export const getButtonLabel = (token: KRC20TokenResponse | null, isMintable: boolean) => {
  if (!token || token.state === 'unused') return 'Token Not Deployed'
  if (!isMintable) return 'Supply Is Already Minted'
  return 'Next'
}