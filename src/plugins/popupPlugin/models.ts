import Transaction from '../../transaction/transaction'
import { UserData } from '../../user/models'
import {
  WebWidgetAuthParams,
  WebWidgetAuthResult,
  WebWidgetNewChainAccountParams,
  WebWidgetNewChainAccountResult,
  WebWidgetRecoverAccountParams,
  WebWidgetRecoverAccountResult,
  WebWidgetSignResult,
} from '../../webWidget/models'

export interface PopupPluginError {
  errors?: string
  data?: any
}

export type PopupPluginAuthSuccessResults = WebWidgetAuthResult & { user: UserData }

export interface PopupPluginAuthParams {
  params: WebWidgetAuthParams
}

export interface PopupPluginSignParams {
  transaction: Transaction
}

export type PopupPluginNewChainAccountSuccessResults = WebWidgetNewChainAccountResult & { chainNetwork: string }

export interface PopupPluginNewChainAccountParams {
  params: Partial<WebWidgetNewChainAccountParams>
}

export interface PopupPluginRecoverAccountParams {
  params: Partial<WebWidgetRecoverAccountParams>
}

export interface PopupPluginLogoutParams {}

export interface PopupPlugin {
  auth: (args: PopupPluginAuthParams) => Promise<PopupPluginAuthSuccessResults>
  sign: (args: PopupPluginSignParams) => Promise<WebWidgetSignResult>
  newChainAccount: (args: PopupPluginNewChainAccountParams) => Promise<PopupPluginNewChainAccountSuccessResults>
  recoverAccount: (args: PopupPluginRecoverAccountParams) => Promise<WebWidgetRecoverAccountResult>
}
