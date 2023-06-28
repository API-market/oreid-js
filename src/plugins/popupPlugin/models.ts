import { SignStringData } from '../../transaction/models'
import Transaction from '../../transaction/transaction'
import { UserData } from '../../user/models'
import {
  WebWidgetAuthParams,
  WebWidgetAuthResult,
  WebWidgetBuyParams,
  WebWidgetBuyResult,
  WebWidgetKeyExportParams,
  WebWidgetKeyExportResult,
  WebWidgetLogoutParams,
  WebWidgetNewChainAccountParams,
  WebWidgetNewChainAccountResult,
  WebWidgetRecoverAccountParams,
  WebWidgetRecoverAccountResult,
  WebWidgetSignResult,
} from '../../webWidget/models'

// params

export type PopupPluginBuyParams = WebWidgetBuyParams

export type PopupPluginAuthParams = WebWidgetAuthParams

export type PopupPluginLogoutParams = Partial<WebWidgetLogoutParams>

export type PopupPluginNewChainAccountParams = Partial<WebWidgetNewChainAccountParams>

export type PopupPluginRecoverAccountParams = Partial<WebWidgetRecoverAccountParams>

export type PopupPluginKeyExportParams = WebWidgetKeyExportParams

export type PopupPluginSignParams = {
  signString?: SignStringData
  transaction?: Transaction
}

// results

export type PopupPluginAuthSuccessResults = WebWidgetAuthResult & { user: UserData }

export type PopupPluginBuySuccessResults = WebWidgetBuyResult

export type PopupPluginLogoutResults = WebWidgetNewChainAccountResult

export type PopupPluginNewChainAccountResults = WebWidgetNewChainAccountResult & { chainNetwork: string }

export type PopupPluginRecoverAccountResults = WebWidgetRecoverAccountResult

export type PopupPluginSignResults = WebWidgetSignResult

export type PopupPluginKeyExportSuccessResults = WebWidgetKeyExportResult

export interface PopupPlugin {
  auth: (args: PopupPluginAuthParams) => Promise<PopupPluginAuthSuccessResults>
  sign: (args: PopupPluginSignParams) => Promise<PopupPluginSignResults>
  newChainAccount: (args: PopupPluginNewChainAccountParams) => Promise<PopupPluginNewChainAccountResults>
  recoverAccount: (args: PopupPluginRecoverAccountParams) => Promise<PopupPluginRecoverAccountResults>
  buy: (args: PopupPluginBuyParams) => Promise<PopupPluginBuySuccessResults>
  keyExport: (args?: PopupPluginKeyExportParams) => Promise<PopupPluginKeyExportSuccessResults>
}
