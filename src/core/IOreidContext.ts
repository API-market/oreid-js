import { PopupPlugin } from '../plugins/popupPlugin/models'
import { OreIdOptions } from './IOreIdOptions'
import { AccessTokenHelper } from '../auth/accessTokenHelper'
import {
  ApiEndpoint,
  AppAccessToken,
  ChainNetwork,
  ExternalWalletType,
  ProcessId,
  RequestType,
  SettingChainNetwork,
} from '../models'
import LocalState from '../utils/localState'
import { AppAccessTokenMetadata } from './models'

// oreid-js
/** interface to pass OreId members to helper classes (e.g. User) */
export default interface OreIdContext {
  accessToken: string
  accessTokenHelper: AccessTokenHelper
  localState: LocalState
  options: OreIdOptions
  transitProvidersInstalled: ExternalWalletType[]
  ualProvidersInstalled: ExternalWalletType[]
  addAccessTokenAndHmacToUrl: (
    urlString: string,
    appAccessTokenMetadata: AppAccessTokenMetadata,
    overrideAppAccessToken?: AppAccessToken,
  ) => Promise<string>
  callOreIdApi: (
    requestMethod: RequestType,
    endpoint: ApiEndpoint,
    params: { [key: string]: any },
    overrideAccessToken?: string,
    processId?: ProcessId,
  ) => Promise<any>
  getAllChainNetworkSettings: () => Promise<SettingChainNetwork[]>
  getChainNetworkByChainId: (chainId: string) => Promise<ChainNetwork>
  getChainNetworkSettings: (chainNetwork: ChainNetwork) => Promise<SettingChainNetwork>
  isAValidExternalWalletType: (walletType: ExternalWalletType) => boolean
  logout: () => void
  setIsBusy: (value: boolean) => void
  isInitialized: boolean
  popup?: PopupPlugin
}
