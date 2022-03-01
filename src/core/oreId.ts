/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios'
import TransitHelper from '../transit/TransitHelper'
import Helpers from '../utils/helpers'
import IOreidContext from './IOreidContext'
import LocalState from '../utils/localState'
import { defaultOreIdServiceUrl, providersNotImplemented, publicApiEndpoints, version } from '../constants'
import { generateHmac } from '../utils/hmac'
import { getTransitProviderAttributes, transitProviderAttributesData } from '../transit/transitProviders'
import {
  ApiEndpoint,
  AppAccessToken,
  AppAccessTokenMetadata,
  AuthProvider,
  ChainNetwork,
  ChainPlatformType,
  Config,
  ExternalWalletInterface,
  ExternalWalletType,
  NewAccountOptions,
  NewAccountResult,
  NewAccountWithOreIdResult,
  OreIdOptions,
  ProcessId,
  RequestType,
  SettingChainNetwork,
  SettingChainNetworkHost,
  SignResult,
  SignStringParams,
  TransactionData,
} from '../models'
import StorageHandler from '../utils/storage'
import AccessTokenHelper from '../auth/accessTokenHelper'
import {
  ApiConvertOauthTokensParams,
  ApiCustodialMigrateAccountParams,
  ApiCustodialNewAccountParams,
  ApiGetAppTokenParams,
  ApiPasswordLessSendCodeParams,
  ApiPasswordLessVerifyCodeParams,
  callApiConvertOauthTokens,
  callApiCustodialMigrateAccount,
  callApiCustodialNewAccount,
  callApiGetAppToken,
  callApiGetConfig,
  callApiPasswordLessSendCode,
  callApiPasswordLessVerifyCode,
} from '../api'
import { getOreIdNewAccountUrl } from './urlGenerators'
import Auth from '../auth/auth'
import Transaction from '../transaction/transaction'

const { isNullOrEmpty } = Helpers

export default class OreId implements IOreidContext {
  constructor(options: OreIdOptions) {
    this._options = null
    const storageHandler = this.options?.storageHandler || new StorageHandler()
    this._localState = new LocalState(this.options?.appId, storageHandler)
    this.cachedChainNetworks = null
    this.validateAndSetOptions(options)
    // create an instance of the Transit Helper class
    this._transitHelper = new TransitHelper(this)
    // All installed TransitProviders
    this.transitHelper.installTransitProviders()
    this._auth = new Auth({ oreIdContext: this })
  }

  _accessTokenHelper: AccessTokenHelper

  _auth: Auth

  _localState: LocalState

  _options: OreIdOptions

  _transitHelper: TransitHelper

  cachedChainNetworks: SettingChainNetwork[] = []

  isBusy: boolean

  /** Names of all Transit providers installed (provided to this constructor) */
  transitProvidersInstalled: ExternalWalletType[] = []

  /** accessToken (stored in localState) */
  get accessToken() {
    return this.localState.accessToken
  }

  /** accessToken helper functions and current state */
  get accessTokenHelper() {
    return this._accessTokenHelper
  }

  // authenticate flows and login state
  get auth() {
    return this._auth
  }

  /** whether the current appId is a demo app */
  get isDemoApp() {
    return this.options?.appId?.toLowerCase().startsWith('demo') || false
  }

  /** helper to persist data (e.g. accessToken) */
  get localState() {
    return this._localState
  }

  /** oreid options used in constructor */
  get options() {
    return this._options
  }

  /** transit wallet plugin helper functions and connections */
  get transitHelper() {
    return this._transitHelper
  }

  /** If we're running in the browser, we must use a proxy server to talk to OREID api
  Unless, we are running the demo app, in which case CORS is disabled by OREID server */
  get requiresProxyServer() {
    // if we aren't using an apiKey, we dont ever need a proxy server
    if (this?.options?.isUsingProxyServer) return true
    if (!this?.options?.apiKey) return false
    return Helpers.isInBrowser && !this.isDemoApp
  }

  /** Throw if the required plug-in is not installed */
  assertHasWalletProviderInstalled(provider: ExternalWalletType, providerType: ExternalWalletInterface) {
    if (providerType === ExternalWalletInterface.Transit) {
      if (!this.transitHelper.hasTransitProvider(provider)) {
        throw Error(`Transit provider ${provider} not installed. Please pass it in via eosTransitWalletProviders.`)
      }
    }
  }

  /** Calls getConfigFromApi() to retrieve settings for all chain networks defined by OreID service
   * and caches the result */
  async getChainNetworks(): Promise<SettingChainNetwork[]> {
    if (isNullOrEmpty(this.cachedChainNetworks)) {
      // load the chainNetworks list from the ORE ID API
      const results = await this.getConfigFromApi(Config.Chains)
      this.cachedChainNetworks = results.chains // as SettingChainNetwork[]
    }

    return this.cachedChainNetworks
  }

  /** Returns config for specified chain network */
  async getNetworkConfig(chainNetwork: ChainNetwork): Promise<SettingChainNetworkHost> {
    const networks = await this.getChainNetworks()
    const chainConfig = networks.find(n => n.network === chainNetwork)
    if (!chainConfig) {
      throw new Error(`Invalid chain network: ${chainNetwork}.`)
    }
    const { hosts } = chainConfig
    const { chainId, host, port, protocol } = hosts[0] // using first host
    return { host, port, protocol, chainId }
  }

  async getChainNetworkSettings(chainNetwork: ChainNetwork) {
    const networks = await this.getChainNetworks()
    return networks.find(n => n.network === chainNetwork)
  }

  /** Returns true if network is NOT an EOS sisterchain */
  async isNotEosNetwork(chainNetwork: ChainNetwork) {
    const networkSetting = await this.getChainNetworkSettings(chainNetwork)
    return !(networkSetting.type === ChainPlatformType.eos || networkSetting.type === ChainPlatformType.ore)
  }

  /** Call oreid api to send a password login code
    email - api/account/login-passwordless-send-code?provider=email&email=me@aikon.com
    phone - api/account/login-passwordless-send-code?provider=phone&phone=+12125551212 */
  async passwordlessSendCodeApi(params: ApiPasswordLessSendCodeParams) {
    let result = {}

    try {
      result = await callApiPasswordLessSendCode(this, params)
    } catch (error) {
      return { error }
    }

    return result
  }

  /** Call oreid api to send a password login code
    email - api/account/login-passwordless-verify-code?provider=email&email=me@aikon.com&code=473830
    phone - api/account/login-passwordless-verify-code?provider=phone&phone=12125551212&code=473830 */
  async passwordlessVerifyCodeApi(params: ApiPasswordLessVerifyCodeParams) {
    let result = {}

    try {
      result = await callApiPasswordLessVerifyCode(this, params)
    } catch (error) {
      return { error }
    }

    return result
  }

  /** Request OREID to create a new blockchain account in an existing user's wallet
   *  This is an advanced feature - it most cases, blockchain accounts will be created automatically upon first login
   */
  async newAccount(newAccountOptions: NewAccountOptions) {
    const { provider } = newAccountOptions

    if (providersNotImplemented.includes(provider)) {
      throw new Error('Not Implemented')
    }

    return this.newAccountWithOreId(newAccountOptions)
  }

  async newAccountWithOreId(newAccountOptions: NewAccountOptions): Promise<NewAccountWithOreIdResult> {
    const { account, accountType, chainNetwork, accountOptions, provider, state } = newAccountOptions || {}
    const { newAccountCallbackUrl, backgroundColor } = this.options
    const args = {
      account,
      accountType,
      backgroundColor,
      chainNetwork,
      accountOptions,
      provider,
      callbackUrl: newAccountCallbackUrl,
      state,
    }
    const newAccountUrl = await getOreIdNewAccountUrl(this, args)
    return { newAccountUrl, errors: null }
  }

  /** Sign an arbitrary string (instead of a transaction)
   *  NOTE: Currently this only supports Transit wallets - not OREID siging
   */
  async signStringWithWallet(params: SignStringParams) {
    const { account, walletType, chainNetwork } = params
    if (!this.transitHelper.canSignString(walletType)) {
      throw Error(`The specific walletType ${walletType} does not support signString`)
    }
    const signResult = await this.transitHelper.signStringWithTransitProvider(params)
    const provider = Helpers.toEnumValue(AuthProvider, walletType)
    await this.transitHelper.callDiscoverAfterSign({ account, chainNetwork, signOptions: { provider } })
    return signResult
  }

  /** ensure all required parameters are provided */
  assertValidSignStringParams(params: SignStringParams) {
    const { walletType, account, chainNetwork, string } = params
    let missingFields = ''
    if (!walletType) missingFields += 'walletType, '
    if (!account) missingFields += 'account, '
    if (!chainNetwork) missingFields += 'chainNetwork, '
    if (!string) missingFields += 'string, '
    if (missingFields) {
      throw new Error(`Missing parameter(s): ${missingFields}`)
    }
  }

  /** Create a new user account that is managed by your app
   * Requires a wallet password (userPassword) on behalf of the user
   * Requires an apiKey and a serviceKey with the createUser right
   * Returns: accountName of newly created account
   *       OR errorCode, errorMessage, and message if any problems */
  async custodialNewAccount(accountOptions: ApiCustodialNewAccountParams) {
    const response = await callApiCustodialNewAccount(this, accountOptions)
    if (response?.errorCode || response?.errorMessage) throw new Error(response.errorMessage)
    return response
  }

  /** Call the custodial/migrate-user api
   * Converts a user account to a new account type
   * Usually used to convert a virtal account to a native account (on-chain)
   * .. and expects the account to be a managed (custodial) account
   * Requires a wallet password (userPassword) on behalf of the user
   * Requires an apiKey and a serviceKey with the accountMigration right
   * Returns: account name of migrated account
   *       OR errorCode, errorMessage, and message if any problems */
  async custodialMigrateAccount(migrateOptions: ApiCustodialMigrateAccountParams) {
    const response = await callApiCustodialMigrateAccount(this, migrateOptions)
    if (response?.errorCode || response?.errorMessage) throw new Error(response.errorMessage)
    return response
  }

  /** Call the account/convert-oauth api
   * Converts OAuth tokens from some 3rd-party source to OREID Oauth tokens
   * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
   * Returns: OreId issued accessToken and idToken
   * */
  async convertOauthTokens(oauthOptions: ApiConvertOauthTokensParams) {
    return callApiConvertOauthTokens(this, oauthOptions)
  }

  async getChainNetworkByChainId(chainId: string) {
    const networks = await this.getChainNetworks()
    const chainConfig = networks.find(n => n.hosts.find(h => h.chainId === chainId))

    if (!isNullOrEmpty(chainConfig)) {
      return chainConfig.network
    }
    return null
  }

  setIsBusy(value: boolean) {
    if (this.isBusy !== value) {
      this.isBusy = value
      if (this.options.setBusyCallback) {
        this.options.setBusyCallback(value)
      }
    }
  }

  // TODO add validation of newer options
  /**  Validates startup options */
  validateAndSetOptions(options: OreIdOptions) {
    const { appId, apiKey, oreIdUrl, serviceKey } = options || {}
    let errorMessage = ''
    // set options now since this.requiresProxyServer needs it set
    this._options = options

    // Apply default options
    if (options) this.options.oreIdUrl = oreIdUrl || defaultOreIdServiceUrl

    if (!appId) {
      errorMessage +=
        '\n --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.'
    }

    // api-key will be injected by the proxy server - so isn't required here
    // if (!this.requiresProxyServer && !apiKey) {
    //   errorMessage +=
    //     '\n --> Missing required parameter - apiKey. You can get an apiKey when you register your app with ORE ID.'
    // }

    // api-key and service-key not allowed if this is being instantiated in the browser
    if (this.requiresProxyServer && (apiKey || serviceKey)) {
      errorMessage +=
        '\n --> You cant include the apiKey (or serviceKey) when creating an instance of OreId that runs in the browser. This is to prevent your keys from being visible in the browser. If this app runs solely in the browser (like a Create React App), you need to set-up a proxy server to protect your keys. Refer to https://github.com/TeamAikon/ore-id-docs. Note: You wont get this error when using the appId and apiKey for a demo app (appId starts with demo_).'
    }
    if (errorMessage !== '') {
      throw new Error(`Options are missing or invalid. ${errorMessage}`)
    }
  }

  /** Loads settings value from the server
    e.g. configType='chains' returns valid chain types and addresses */
  async getConfig(configType: Config) {
    return this.getConfigFromApi(configType)
  }

  /** Gets a single-use token to access the service */
  async getAppAccessToken(params?: ApiGetAppTokenParams) {
    return callApiGetAppToken(this, params)
  }

  /** Extracts the response parameters on the /new-account callback URL string */
  handleNewAccountResponse(callbackUrlString: string): NewAccountResult {
    const { chain_account: chainAccount, process_id: processId, state, errors } = Helpers.extractDataFromCallbackUrl(
      callbackUrlString,
    )
    this.setIsBusy(false)
    return { chainAccount, processId, state, errors }
  }

  /** Extracts and returns the response parameters from the /sign callback URL string */
  handleSignCallback(callbackUrlString: string): SignResult {
    let signedTransaction
    const {
      signed_transaction: encodedTransaction,
      process_id: processId,
      state,
      transaction_id: transactionId,
      errors,
    } = Helpers.extractDataFromCallbackUrl(callbackUrlString)

    if (!errors) {
      // Decode base64 parameters
      signedTransaction = Helpers.base64DecodeSafe(encodedTransaction)
    }
    this.setIsBusy(false)
    return { signedTransaction, processId, state, transactionId, errors }
  }

  /**
   *  Call api services/config to get configuration values of a specific type
   *  Returns: for configType:Config.Chains, returns array of SettingChainNetwork objects for all chains suported by the service
   * */
  async getConfigFromApi(configType: Config.Chains) {
    const values = await callApiGetConfig(this, { configType })
    if (Helpers.isNullOrEmpty(values)) {
      throw new Error(`Not able to retrieve config values for ${configType}`)
    }
    return values
  }

  /** Helper function to call api endpoint and inject api-key
    here params can be query params in case of a GET request or body params in case of POST request
    processId (optional) - can be used to associate multiple calls together into a single process flow
  */
  async callOreIdApi(
    requestMethod: RequestType,
    endpoint: ApiEndpoint,
    params: { [key: string]: any } = {},
    /** Required if apiKey is not provider (optional otherwise) */
    overrideAccessToken?: string,
    processId: ProcessId = null,
  ) {
    let urlString
    let response
    const headers: { [key: string]: any } = {}
    const { apiKey, serviceKey, oreIdUrl } = this.options
    // if running in browser, we dont call the api directly, we use a proxy server (unless we're running a demo app)
    // calls to the proxy server must start with '/' (not an host like http://server) and we'll prepend 'oreid' to it e.g. /oreid/api/xxx to make it easier to do proxy server routing
    const oreIdUrlBase = this.requiresProxyServer ? '/oreid' : oreIdUrl
    const url = `${oreIdUrlBase}/api/${endpoint}`
    const accessToken = overrideAccessToken || this.accessToken

    if (!apiKey && !accessToken && !publicApiEndpoints.includes(endpoint)) {
      throw new Error('OreId API request requires either apiKey or accessToken')
    }

    // apiKey is optional (accessToken is required if apiKey not provided)
    if (apiKey) {
      headers['api-key'] = apiKey
    }

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    if (!isNullOrEmpty(serviceKey)) {
      headers['service-key'] = serviceKey
    }
    if (!isNullOrEmpty(processId)) {
      headers['process-id'] = processId
    }
    // add sdk version to request header
    headers['sdk-version'] = `oreidjs/${version}`

    try {
      // GET
      if (requestMethod === RequestType.Get) {
        if (!isNullOrEmpty(params)) {
          urlString = Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&')
        }

        const urlWithParams = urlString ? `${url}?${urlString}` : url
        response = await axios.get(urlWithParams, { headers })
      }
      // POST
      if (requestMethod === RequestType.Post) {
        const body = !isNullOrEmpty(params) ? JSON.stringify(params) : null
        response = await axios.post(url, body, {
          headers: { 'Content-Type': 'application/json', ...headers },
          // body: params,
        })
      }
    } catch (networkError) {
      const error = Helpers.getErrorFromAxiosError(networkError)
      throw error
    }

    const { data } = response
    return data
  }

  /** Clears user's accessToken and user profile data */
  logout() {
    this.localState.clear()
  }

  getWalletProviderInfo(provider: AuthProvider, type: ExternalWalletInterface) {
    if (!provider || !type) {
      return {
        transitProviderAttributes: transitProviderAttributesData,
      }
    }

    if (type === ExternalWalletInterface.Transit) {
      const walletProvider = Helpers.mapAuthProviderToWalletType(provider)
      return getTransitProviderAttributes(walletProvider)
    }

    return null
  }

  /** Create a new Transaction object - used for composing and signing transactions */
  async createTransaction(data: TransactionData) {
    return new Transaction({ oreIdContext: this, user: this.auth.user, data })
  }

  /** Add an app access token and hmac signature to the url
   *  If running in browser, calls proxy server at /oreid/prepare-url to do both (since they require teh apiKey secret) */
  async addAccessTokenAndHmacToUrl(
    urlString: string,
    appAccessTokenMetadata: AppAccessTokenMetadata,
    overrideAppAccessToken?: AppAccessToken,
  ): Promise<string> {
    const { appId } = this.options
    // running in browser
    if (this.requiresProxyServer) {
      // retrieve and append an app-access-token and a matching hmac signature to the end of the url
      // calling the proxy server is required to protect the secrets needed to get the access token and to generate the hmac
      const response = await axios.post('/oreid/prepare-url', { appAccessTokenMetadata, urlString })
      return response?.data?.urlString
    }
    let completeUrl = `${urlString}&app_id=${appId}`

    // if we need app token metadata, then we generate and add an appAccessToken
    if (!isNullOrEmpty(appAccessTokenMetadata)) {
      const appAccessToken = overrideAppAccessToken || (await this.getAppAccessToken({ appAccessTokenMetadata }))
      completeUrl = `${completeUrl}&app_access_token=${appAccessToken}`
    }

    let hmacParam = ''
    // An hmac is no longer required - however, if we have an apiKey, we can generate one
    if (this.options?.apiKey) {
      const hmac = generateHmac(this.options.apiKey, completeUrl)
      const urlEncodedHmac = encodeURIComponent(hmac)
      hmacParam = `&hmac=${urlEncodedHmac}`
    }
    return `${completeUrl}${hmacParam}`
  }
}
