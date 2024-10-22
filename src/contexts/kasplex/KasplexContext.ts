import { createContext } from 'react'
import { IKasplex } from './kasplexReducer'

export const KasplexContext = createContext<
  | {
      loadKrc20Tokens: (refresh?: boolean) => Promise<void> // Accept refresh parameter
      loadKrc20Transactions: (tick?: string, next?: string, prev?: string) => Promise<void>
      kasplex: IKasplex
    }
  | undefined
>(undefined)
