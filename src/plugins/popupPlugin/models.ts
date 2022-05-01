import Transaction from '../../transaction/transaction'
import { UserData } from '../../user/models'
import {
  WebWidgetAuthParams,
  WebWidgetAuthResult,
  WebWidgetLogoutResult,
  WebWidgetNewChainAccountParams,
  WebWidgetNewChainAccountResult,
  WebWidgetRecoverAccountParams,
  WebWidgetRecoverAccountResult,
  WebWidgetSignResult,
} from '../../webWidget/models'

export type PopupPluginError = ({ errors, data }: { errors?: string; data?: any }) => void

export type PopupPluginAuthSuccessResults = WebWidgetAuthResult & { user: UserData }

export interface PopupPluginAuthParams {
  params: WebWidgetAuthParams
  onError?: PopupPluginError
  onSuccess?: (result: PopupPluginAuthSuccessResults) => void
}

export interface PopupPluginSignParams {
  transaction: Transaction
  onError?: PopupPluginError
  onSuccess?: (result: WebWidgetSignResult) => void
}

export type PopupPluginNewChainAccountSuccessResults = WebWidgetNewChainAccountResult & { chainNetwork: string }

export interface PopupPluginNewChainAccountParams {
  params: Partial<WebWidgetNewChainAccountParams>
  onError?: PopupPluginError
  onSuccess?: (result: PopupPluginNewChainAccountSuccessResults) => void
}

export interface PopupPluginRecoverAccountParams {
  params: Partial<WebWidgetRecoverAccountParams>
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
