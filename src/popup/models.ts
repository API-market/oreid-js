import { ChainNetwork } from '../common/models'
import Transaction from '../transaction/transaction'
import { UserData } from '../user/models'
import { WebWidgetAuthParams, WebWidgetRecoverAccountResult, WebWidgetSignResult } from '../webWidget/models'

type OnError = ({ errors, data }: { errors?: string; data?: any }) => void

interface AuthParams {
  params: WebWidgetAuthParams
  onError?: OnError
  onSuccess?: (user: UserData) => void
}

interface SignParams {
  transaction: Transaction
  onError?: OnError
  onSuccess?: (result: WebWidgetSignResult) => void
}

interface NewChainAccountParams {
  params: { accountType?: string; chainNetwork: ChainNetwork; accountOptions?: any }
  onError?: OnError
  onSuccess?: (chainAccount: string) => void
}

interface RecoverAccountParams {
  params: { provider?: string; recoverAction?: string }
  onError?: OnError
  onSuccess?: (result: WebWidgetRecoverAccountResult) => void
}

export interface PopUp {
  auth: (args: AuthParams) => void
  sign: (args: SignParams) => void
  newChainAccount: (args: NewChainAccountParams) => void
  recoverAccount: (args: RecoverAccountParams) => void
}
