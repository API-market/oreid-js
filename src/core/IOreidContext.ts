import {
  ApiEndpoint,
  AppAccessToken,
  ChainNetwork,
  ExternalWalletType,
  OreIdOptions,
  ProcessId,
  RequestType,
  SettingChainNetwork,
  SettingChainNetworkHost,
} from '../models'
import AccessTokenHelper from '../auth/accessTokenHelper'
import LocalState from '../utils/localState'
import { AppAccessTokenMetadata } from './models'

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
  getChainNetworks: () => Promise<SettingChainNetwork[]>
  getChainNetworkSettings: (chainNetwork: ChainNetwork) => Promise<SettingChainNetwork>
  getNetworkConfig: (chainNetwork: ChainNetwork) => Promise<SettingChainNetworkHost>
  isNotEosNetwork: (chainNetwork: ChainNetwork) => Promise<boolean>
  setIsBusy: (value: boolean) => void
}
