import { createContext } from 'react'
import { IKasplex } from './kasplexReducer'

export const KasplexContext = createContext<
  | {
      loadTokens: (refresh?: boolean) => Promise<void> // Accept refresh parameter
      loadOperations: (tick?: string, next?: string, prev?: string) => Promise<void>
      kasplex: IKasplex
    }
  | undefined
>(undefined)
