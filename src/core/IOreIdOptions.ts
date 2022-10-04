import { Color } from '../common/models'
import { PopupPlugin } from '../plugins/models'
import { Plugin } from '../plugins/plugin'
import { TransitWalletProviderFactory } from '../transit'
import { UalAuthenticatorFactory } from '../ual'
import IStorage from './IStorage'

export interface OreIdOptions {
  appId: string
  /** appKey is required to call the oreid API */
  apiKey?: string
  appName?: string
  accessToken?: string
  idToken?: string
  authCallbackUrl?: string
  newAccountCallbackUrl?: string
  signCallbackUrl?: string
  backgroundColor?: Color
  /** whether you are using a proxy server - required for api calls or auth calls without idToken */
  isUsingProxyServer?: boolean
  oreIdUrl?: string
  setBusyCallback?: (isBusy: boolean) => void
  eosTransitWalletProviders?: TransitWalletProviderFactory[]
  ualAuthenticators?: UalAuthenticatorFactory[]
  /** Custom implementation of a storage class that saves persistant state for accessToken, etc. */
  storageHandler?: IStorage
  plugins?: { popup?: Plugin<PopupPlugin> }
}
