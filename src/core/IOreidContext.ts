import { PopupPlugin } from '../plugins'
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
import { OreIdOptions } from './IOreIdOptions'
import { AppAccessTokenMetadata } from './models'

// oreid-js
/** interface to pass OreId members to helper classes (e.g. User) */
export default interface OreIdContext {
  accessToken: string
  accessTokenHelper: AccessTokenHelper
  localState: LocalState
  options: OreIdOptions
  transitProvidersInstalled: ExternalWalletType[]
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
  getChainNetworkSettings: (chainNetwork: ChainNetwork) => Promise<SettingChainNetwork>
  logout: () => void
  setIsBusy: (value: boolean) => void
  isInitialized: boolean
  popup?: PopupPlugin
}
