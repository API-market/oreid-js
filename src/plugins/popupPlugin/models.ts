import { ChainNetwork } from '../../common/models'
import Transaction from '../../transaction/transaction'
import { UserData } from '../../user/models'
import {
  WebWidgetAuthParams,
  WebWidgetLogoutResult,
  WebWidgetRecoverAccountResult,
  WebWidgetSignResult,
} from '../../webWidget/models'

export type PopupPluginError = ({ errors, data }: { errors?: string; data?: any }) => void

export interface PopupPluginAuthParams {
  params: WebWidgetAuthParams
  onError?: PopupPluginError
  onSuccess?: (user: UserData) => void
}

export interface PopupPluginSignParams {
  transaction: Transaction
  onError?: PopupPluginError
  onSuccess?: (result: WebWidgetSignResult) => void
}

export interface PopupPluginNewChainAccountParams {
  params: { accountType?: string; chainNetwork: ChainNetwork; accountOptions?: any }
  onError?: PopupPluginError
  onSuccess?: (chainAccount: string) => void
}

export interface PopupPluginRecoverAccountParams {
  params: { provider?: string; recoverAction?: string }
  onError?: PopupPluginError
  onSuccess?: (result: WebWidgetRecoverAccountResult) => void
}

export interface PopupPluginLogoutParams {
  onError?: PopupPluginError
  onSuccess?: (result: WebWidgetLogoutResult) => void
}

export interface PopupPlugin {
  auth: (args: PopupPluginAuthParams) => void
  sign: (args: PopupPluginSignParams) => void
  newChainAccount: (args: PopupPluginNewChainAccountParams) => void
  recoverAccount: (args: PopupPluginRecoverAccountParams) => void
  logout: (args?: PopupPluginLogoutParams) => void
}
