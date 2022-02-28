import {
  ApiEndpoint,
  AppAccessToken,
  AuthProvider,
  ChainNetwork,
  ExternalWalletType,
  OreIdOptions,
  ProcessId,
  RequestType,
  SettingChainNetwork,
  SettingChainNetworkHost,
  SignOptions,
} from '../models'
import AccessTokenHelper from '../auth/accessTokenHelper'
import LocalState from '../utils/localState'
import { AppAccessTokenMetadata } from '.'

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
  callDiscoverAfterSign: (signOptions: SignOptions) => Promise<void>
  callOreIdApi: (
    requestMethod: RequestType,
    endpoint: ApiEndpoint,
    params: { [key: string]: any },
    overrideAccessToken?: string,
    processId?: ProcessId,
  ) => Promise<any>
  canDiscover: (provider: AuthProvider) => boolean
  getChainNetworks: () => Promise<SettingChainNetwork[]>
  getChainNetworkSettings: (chainNetwork: ChainNetwork) => Promise<SettingChainNetwork>
  getNetworkConfig: (chainNetwork: ChainNetwork) => Promise<SettingChainNetworkHost>
  isNotEosNetwork: (chainNetwork: ChainNetwork) => Promise<boolean>
  requiresLogoutLoginToDiscover: (provider: AuthProvider) => boolean
  setIsBusy: (value: boolean) => void
}
