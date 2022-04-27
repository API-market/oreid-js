import { ChainNetwork } from '../common/models'
import Transaction from '../transaction/transaction'
import { UserData } from '../user/models'
import {
  WebWidgetAuthParams,
  WebWidgetLogoutResult,
  WebWidgetRecoverAccountResult,
  WebWidgetSignResult,
} from '../webWidget/models'

export type PopUpError = ({ errors, data }: { errors?: string; data?: any }) => void

export interface PopupAuthParams {
  params: WebWidgetAuthParams
  onError?: PopUpError
  onSuccess?: (user: UserData) => void
}

export interface PopupSignParams {
  transaction: Transaction
  onError?: PopUpError
  onSuccess?: (result: WebWidgetSignResult) => void
}

export interface PopupNewChainAccountParams {
  params: { accountType?: string; chainNetwork: ChainNetwork; accountOptions?: any }
  onError?: PopUpError
  onSuccess?: (chainAccount: string) => void
}

export interface PopupRecoverAccountParams {
  params: { provider?: string; recoverAction?: string }
  onError?: PopUpError
  onSuccess?: (result: WebWidgetRecoverAccountResult) => void
}

export interface PopupLogoutParams {
  onError?: PopUpError
  onSuccess?: (result: WebWidgetLogoutResult) => void
}

export interface PopUp {
  auth: (args: PopupAuthParams) => void
  sign: (args: PopupSignParams) => void
  newChainAccount: (args: PopupNewChainAccountParams) => void
  recoverAccount: (args: PopupRecoverAccountParams) => void
  logout: (args?: PopupLogoutParams) => void
}
