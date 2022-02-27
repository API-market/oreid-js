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
  ApiMessageResponse,
  AppAccessToken,
  AppAccessTokenMetadata,
  AuthProvider,
  AuthResponse,
  ChainNetwork,
  ChainPlatformType,
  Config,
  DiscoverOptions,
  ExternalWalletInterface,
  GetOreIdAuthUrlParams,
  GetOreIdNewAccountUrlParams,
  GetOreIdRecoverAccountUrlParams,
  GetRecoverAccountUrlResult,
  LoginOptions,
  LoginWithOreIdResult,
  NewAccountOptions,
  NewAccountResponse,
  NewAccountWithOreIdResult,
  OreIdOptions,
  ProcessId,
  RequestType,
  SettingChainNetwork,
  SettingChainNetworkHost,
  SignOptions,
  SignResponse,
  SignStringParams,
  SignWithOreIdResult,
} from '../models'
import AccessTokenHelper from '../auth/accessTokenHelper'
import { User } from '../user/user'
import {
  ApiConvertOauthTokensParams,
  ApiCustodialMigrateAccountParams,
  ApiCustodialNewAccountParams,
  ApiGetAppTokenParams,
  ApiLoginUserWithTokenParams,
  ApiPasswordLessSendCodeParams,
  ApiPasswordLessVerifyCodeParams,
  callApiCanAutosignTransaction,
  callApiConvertOauthTokens,
  callApiCustodialMigrateAccount,
  callApiCustodialNewAccount,
  callApiCustodialSignTransaction,
  callApiGetAppToken,
  callApiGetConfig,
  callApiLoginUserWithToken,
  callApiPasswordLessSendCode,
  callApiPasswordLessVerifyCode,
  callApiSignTransaction,
} from '../api'

const { isNullOrEmpty } = Helpers

export default class OreId implements IOreidContext {
  constructor(options: OreIdOptions) {
    this.options = null
    this.localState = new LocalState(options)
    this.cachedChainNetworks = null
    this.validateOptions(options)
    // create an instance of the User class
    this.user = new User({ oreIdContext: this })
    this.transitHelper = new TransitHelper(this, this.user)
    // All installed TransitProviders
    this.transitHelper.installTransitProviders()
  }

  isBusy: boolean

  options: OreIdOptions

  appAccessToken: AppAccessToken

  localState: LocalState

  cachedChainNetworks: SettingChainNetwork[] = []

  accessTokenHelper: AccessTokenHelper

  user: User

  transitHelper: TransitHelper

  /** Names of all Transit providers installed (provided to this constructor) */
  transitProvidersInstalled: AuthProvider[] = []

  /** whether the current appId is a demo app */
  get isDemoApp() {
    return this.options?.appId?.toLowerCase().startsWith('demo') || false
  }

  /** retrieve accessToken saved in local storage - is automatically deleted when token expires */
  get accessToken() {
    if (!this.accessTokenHelper) {
      const savedToken = this.localState?.accessToken
      if (!savedToken) return null
      this.accessToken = savedToken // sets accessTokenHelper
    }
    const hasExpired = this.clearTokenAndUserIfAccessTokenExpired()
    if (hasExpired) return null
    return this.accessTokenHelper?.accessToken
  }

  /** Sets the access token in local storage (and in accessTokenHelper)
   * this token will be used to call ORE ID APIs (on behalf of the user)
   * This token is user-specific - call logout to clear it upon user log-out
   * For an expired token, this function will delete the accessToken (and matching user) from local storage
   * NOTE: This function will be called automatically if you use handleAuthResponse() */
  set accessToken(accessToken: string) {
    try {
      // decodes and validates accessToken is a valid token
      this.accessTokenHelper = new AccessTokenHelper(accessToken)
    } catch (error) {
      console.log('accessToken cant be set: ', error.message)
      return
    }
    const hasExpired = this.clearTokenAndUserIfAccessTokenExpired()
    if (!hasExpired) {
      this.localState.saveAccessToken(accessToken)
      // if account in accessToken account doesn't match currently cached user, clear user
      this.clearLocalStateUserIfNotMatchingAccount(this.accessTokenHelper.accountName)
    }
  }

  /** If we're running in the browser, we must use a proxy server to talk to OREID api
  Unless, we are running the demo app, in which case CORS is disabled by OREID server */
  get requiresProxyServer() {
    // if we aren't using an apiKey, we dont ever need a proxy server
    if (this?.options?.isUsingProxyServer) return true
    if (!this?.options?.apiKey) return false
    return Helpers.isInBrowser && !this.isDemoApp
  }

  clearTokenAndUserIfAccessTokenExpired(): boolean {
    const hasExpired = this.accessTokenHelper?.hasExpired()
    if (!hasExpired) return false
    // clear expired accessToken and user
    this.localState.clearAccessToken()
    this.localState.clearUser()
    this.accessTokenHelper = null
    console.log('accessToken has expired and has been cleared')
    return true
  }

  /** if locally saved user if NOT matches account */
  clearLocalStateUserIfNotMatchingAccount(accountName: string) {
    const cachedUser = this.localState.user
    if (accountName !== cachedUser?.accountName) {
      this.localState.clearUser()
    }
  }

  /** Throw if the required plug-in is not installed */
  assertHasProviderInstalled(provider: AuthProvider, providerType: ExternalWalletInterface) {
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

  /** Returns a loginUrl to redirect the user's browser to login using ORE ID
   *  OR, if the provider is a wallet, prompts the user to login with a wallet */
  async login(loginOptions: LoginOptions) {
    const { provider } = loginOptions

    if (providersNotImplemented.includes(provider)) {
      throw new Error('Not Implemented')
    }

    if (this.transitHelper.isTransitProvider(provider)) {
      return this.loginWithNonOreIdProvider(loginOptions)
    }

    return this.loginWithOreId(loginOptions)
  }

  /** Sign transaction with key(s) in wallet - connect to wallet first */
  async sign(signOptions: SignOptions): Promise<SignWithOreIdResult> {
    // handle sign transaction based on provider type
    const { provider } = signOptions
    this.assertValidSignOptions(signOptions)

    if (providersNotImplemented.includes(provider)) {
      return null
    }

    if (this.isCustodial(provider)) {
      return this.custodialSignWithOreId(signOptions)
    }

    if (this.transitHelper.isTransitProvider(provider)) {
      // if signExternalWithOreId=true, then it means we will do the external signing in the oreid service UX (e.g.  WebPopup) instead of locally in this app
      if (!signOptions.signExternalWithOreId) {
        const signatureProviderSignResults = await this.signWithNonOreIdProvider(signOptions)
        return {
          signedTransaction: JSON.stringify(signatureProviderSignResults),
        }
      }
    }

    return this.signWithOreId(signOptions)
  }

  /** ensure all required parameters are provided */
  assertValidSignOptions(signOptions: SignOptions) {
    const { provider, account, chainNetwork } = signOptions
    let missingFields = ''
    if (!provider) missingFields += 'provider, '
    if (!account) missingFields += 'account, '
    if (!chainNetwork) missingFields += 'chainNetwork, '
    if (missingFields) {
      throw new Error(`Missing parameter(s): ${missingFields}`)
    }
  }

  /** Discovers keys in a wallet provider.
   *  Any new keys discovered in wallet are added to user's ORE ID record.
   *  If the provider doesnt support a discover() function, and requiresLogoutLoginToDiscover == true, attempts a logout then login instead.
   */
  async discover(discoverOptions: DiscoverOptions) {
    return this.transitHelper.discoverWithTransit(discoverOptions)
  }

  /** Returns a loginUrl to redirect the user's browser to login using ORE ID */
  async loginWithOreId(loginOptions: LoginOptions): Promise<LoginWithOreIdResult> {
    const { code, email, idToken, phone, provider, state, linkToAccount, processId, returnAccessToken, returnIdToken } =
      loginOptions || {}
    const { authCallbackUrl, backgroundColor } = this.options
    const args = {
      code,
      email,
      idToken,
      phone,
      provider,
      backgroundColor,
      callbackUrl: authCallbackUrl,
      state,
      linkToAccount,
      processId,
      returnAccessToken: isNullOrEmpty(returnAccessToken) ? true : returnAccessToken, // if returnAccessToken not specified, default to true
      returnIdToken,
    }
    if (idToken) {
      const { accessToken, error, processId: processIdReturned } = await this.loginWithIdToken({ idToken, processId })
      if (!error) {
        this.accessToken = accessToken // saves in cache and in local storage
        this.user.getUserInfoFromApi(this.accessTokenHelper?.accountName)
      }
      return { accessToken, errors: error, processId: processIdReturned || processId }
    }
    const loginUrl = await this.getOreIdAuthUrl(args)
    return { loginUrl, errors: null, processId }
  }

  async newAccountWithOreId(newAccountOptions: NewAccountOptions): Promise<NewAccountWithOreIdResult> {
    const { account, accountType, chainNetwork, accountOptions, provider, state, processId } = newAccountOptions || {}
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
      processId,
    }
    const newAccountUrl = await this.getOreIdNewAccountUrl(args)
    return { newAccountUrl, errors: null }
  }

  /**
   * Whether the provided transaction (or signedTransaction) can be autoSigned via api (without user interaction)
   * Requires a serviceKey with the autoSign right
   * Returns: true if transaction provided can be signed using the signTransaction(autosign:true)
   * */
  async checkIfTrxAutoSignable(signOptions: SignOptions) {
    return callApiCanAutosignTransaction(this, signOptions)
  }

  /** Call api to sign a transaction on behalf of the user
   * This can only be done if autoSign is enabled OR if we are signing for a custodial user where we can provide the wallet password
   * For autoSign param, requires a serviceKey with the autoSign right
   * signOptions param specifies with ApiEndpoint.TransactionSig API (for autosign) or ApiEndpoint.CustodialSign
   * Returns: stringified signedTransaction (and transactionId if available)
   * */
  async callSignTransaction(signEndpoint: ApiEndpoint, signOptions: SignOptions, autoSign = false) {
    let signResults
    if (signEndpoint === ApiEndpoint.TransactionSign) {
      signResults = callApiSignTransaction(this, { signOptions, autoSign })
    } else if (signEndpoint === ApiEndpoint.CustodialSign) {
      signResults = callApiCustodialSignTransaction(this, { signOptions, autoSign })
    }
    return signResults
  }

  /** Attempt to sign a transaction without user interaction
   *  Expects user to have previously approved autoSign for transaction type and it hasn't expired
   *  Call callApiCanAutosignTransaction() first to confirm that this transaction can be autoSigned before attempting this call
   */
  async autoSignTransaction(signOptions: SignOptions) {
    const signEndpoint = ApiEndpoint.TransactionSign
    const { processId, signedTransaction, transactionId, errorCode, errorMessage } = await this.callSignTransaction(
      signEndpoint,
      signOptions,
      true,
    )
    if (errorCode || errorMessage) throw new Error(errorMessage)
    return { processId, signedTransaction, transactionId }
  }

  /** Attempts to sign a transaction using autoSign if possible
   * If autoSign is not available, returns a url to redirect the user to to be prompted to enter wallet password to sign a transaction
   */
  async signWithOreId(signOptions: SignOptions): Promise<SignWithOreIdResult> {
    let canAutoSign = false
    // to use ORE ID to sign, we dont need to specify a login provider
    // if OreId was specified, this just means dont use an external wallet, so we remove that here
    if (signOptions?.provider === AuthProvider.OreId) {
      signOptions.provider = null
    }

    try {
      const results = await this.checkIfTrxAutoSignable(signOptions)
      canAutoSign = results.autoSignCredentialsExist
    } catch (error) {
      // do nothing - this will leave canAutoSign = false
      // checkIfTrxAutoSignable will throw if a serviceKey isn't provided - most callers won't have a serviceKey and cant autosign
    }

    // auto sign defaults to true if the transaction is auto signable. Developer can opt out by setting preventAutoSign to true
    const { preventAutoSign = false } = signOptions

    if (canAutoSign && !preventAutoSign) {
      const { processId, signedTransaction, transactionId } = await this.autoSignTransaction(signOptions)
      return { processId, signedTransaction, transactionId }
    }

    const { signCallbackUrl } = this.options
    signOptions.callbackUrl = signCallbackUrl
    const signUrl = await this.getOreIdSignUrl(signOptions)
    return { signUrl, errors: null }
  }

  async custodialSignWithOreId(signOptions: SignOptions) {
    const { serviceKey } = this.options
    if (!serviceKey) {
      throw new Error('Missing serviceKey in oreId config options - required to call api/custodial/new-user.')
    }

    const { processId, signedTransaction, transactionId, errorCode, errorMessage } = await this.callSignTransaction(
      ApiEndpoint.CustodialSign,
      signOptions,
    )
    if (errorCode || errorMessage) throw new Error(errorMessage)
    return { processId, signedTransaction, transactionId }
  }

  /** Sign an arbitrary string (instead of a transaction)
   *  NOTE: Currently this only supports Transit wallets - not OREID siging
   */
  async signString(signOptions: SignStringParams) {
    const { account, provider, chainNetwork } = signOptions
    if (!this.canSignString(provider)) {
      throw Error(`The specific provider ${provider} does not support signString`)
    }
    const signResults = await this.transitHelper.signStringWithTransitProvider(signOptions)
    await this.callDiscoverAfterSign({ account, provider, chainNetwork })
    return signResults
  }

  /** ensure all required parameters are provided */
  assertValidSignStringParams(signOptions: SignStringParams) {
    const { provider, account, chainNetwork, string } = signOptions
    let missingFields = ''
    if (!provider) missingFields += 'provider, '
    if (!account) missingFields += 'account, '
    if (!chainNetwork) missingFields += 'chainNetwork, '
    if (!string) missingFields += 'string, '
    if (missingFields) {
      throw new Error(`Missing parameter(s): ${missingFields}`)
    }
  }

  /** Call discover after signing so we capture and save the account
   *  Note: This is needed for Ethereum since we dont know a public key until we sign with an account
   */
  async callDiscoverAfterSign(signOptions: SignOptions) {
    const { provider, chainNetwork, account } = signOptions
    const discoverOptions: DiscoverOptions = {
      provider,
      chainNetwork,
      oreAccount: account,
    }
    await this.discover(discoverOptions)
  }

  // Supported features by provider

  /** whether discovery is supported by the provider */
  canDiscover(provider: AuthProvider) {
    if (this.transitHelper.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).supportsDiscovery
    }
    return false
  }

  /** whether signString is supported by the provider */
  canSignString(provider: AuthProvider) {
    if (this.transitHelper.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).supportsSignArbitrary
    }
    return false
  }

  /** whether call to discover is required by provider before login */
  requiresDiscoverToLogin(provider: AuthProvider) {
    if (this.transitHelper.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).requiresDiscoverToLogin
    }
    return false
  }

  /** whether call to logout then login is required by provider before discover */
  requiresLogoutLoginToDiscover(provider: AuthProvider) {
    if (this.transitHelper.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).requiresLogoutLoginToDiscover
    }
    return false
  }

  /** default path index for provider (if any) */
  defaultDiscoveryPathIndexList(provider: AuthProvider): number[] {
    if (this.transitHelper.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider)?.defaultDiscoveryPathIndexList
    }
    return null
  }

  /** help text displayed to user for provider */
  helpTextForProvider(provider: AuthProvider) {
    if (this.transitHelper.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).helpText
    }

    return null
  }

  /** sign with a wallet via Transit */
  async signWithNonOreIdProvider(signOptions: SignOptions) {
    const isTransitProvider = this.transitHelper.isTransitProvider(signOptions.provider)
    if (!isTransitProvider) return null
    return this.transitHelper.signWithTransitProvider(signOptions)
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

  /** Call api account/login-user-with-token
   * Converts OAuth idToken from some 3rd-party source to OREID Oauth accessTokens
   * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings
   * If a user does not curently exist that matches the info in the incoming idToken, a new OreID user and account is created
   * Requires a valid idToken but no accessToken or apiKey
   * Returns: OreId issued accessToken and user's account name (if new account created, this is a new account name)
   * */
  async loginWithIdToken(
    oauthOptions: ApiLoginUserWithTokenParams,
  ): Promise<{ accessToken: string } & ApiMessageResponse> {
    const accessTokenHelper = new AccessTokenHelper(oauthOptions?.idToken, true)
    if (!accessTokenHelper.decodedToken) {
      return {
        accessToken: null,
        error: 'token_invalid',
        message: 'idToken invalid or corrupt',
        processId: oauthOptions.processId,
      }
    }
    if (!AccessTokenHelper.isTokenDateValidNow(accessTokenHelper.decodedToken)) {
      return {
        accessToken: null,
        error: 'token_expired',
        message: 'idToken provided is expired',
        processId: oauthOptions.processId,
      }
    }
    const response = await callApiLoginUserWithToken(this, oauthOptions)

    return {
      accessToken: response.accessToken,
      error: response?.errorCode,
      message: response?.errorMessage,
      processId: response?.processId,
    }
  }

  /** Login using the wallet provider */
  async loginWithNonOreIdProvider(loginOptions: LoginOptions) {
    const { provider } = loginOptions
    if (this.transitHelper.isTransitProvider(provider)) {
      return this.transitHelper.loginWithTransitProvider(loginOptions)
    }
    throw new Error(`Not a valid External Wallet provider: ${provider}`)
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
  validateOptions(options: OreIdOptions) {
    const { appId, apiKey, oreIdUrl, serviceKey } = options || {}
    let errorMessage = ''
    // set options now since this.requiresProxyServer needs it set
    this.options = options

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
  async getConfig(configType: Config, processId: ProcessId = null) {
    return this.getConfigFromApi(configType, processId)
  }

  /** Gets a single-use token to access the service */
  async getAppAccessToken(params?: ApiGetAppTokenParams) {
    return callApiGetAppToken(this, params)
  }

  /** Returns a fully formed url to call the new-account endpoint */
  async getOreIdNewAccountUrl(args: GetOreIdNewAccountUrlParams) {
    const {
      account,
      accountType,
      chainNetwork,
      accountOptions,
      provider,
      callbackUrl,
      backgroundColor,
      state,
      processId,
      accessToken,
      idToken,
    } = args
    const { oreIdUrl } = this.options

    // collect additional params embedded into appAccessToken
    const appAccessTokenMetadata: AppAccessTokenMetadata = {
      paramsNewAccount: {
        account,
        accountType,
        chainNetwork,
        accountOptions,
      },
    }

    if (!account || !accountType || !chainNetwork || !provider || !callbackUrl) {
      throw new Error('Missing a required parameter')
    }

    // optional params
    const encodedStateParam = state ? `&state=${state}` : ''
    const processIdParam = processId ? `&process_id=${processId}` : ''
    const accessTokenParam = !isNullOrEmpty(accessToken) ? `&oauth_access_token=${accessToken}` : ''
    const idTokenParam = !isNullOrEmpty(idToken) ? `&oauth_id_token=${idToken}` : ''

    const url =
      `${oreIdUrl}/new-account#provider=${provider}&chain_network=${chainNetwork}` +
      `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(
        backgroundColor,
      )}${encodedStateParam}${processIdParam}`
    return this.addAccessTokenAndHmacToUrl(url, appAccessTokenMetadata)
  }

  /** Returns a fully formed url to call the auth endpoint */
  async getOreIdAuthUrl(args: GetOreIdAuthUrlParams) {
    const {
      code,
      email,
      phone,
      provider,
      callbackUrl,
      backgroundColor,
      state,
      linkToAccount,
      processId,
      returnAccessToken,
      returnIdToken,
    } = args
    const { oreIdUrl } = this.options

    if (!provider || !callbackUrl) {
      throw new Error('Missing a required parameter')
    }

    // optional params
    const encodedStateParam = state ? `&state=${state}` : ''
    const linkToAccountParam = linkToAccount ? `&link_to_account=${linkToAccount}` : ''
    const processIdParam = processId ? `&process_id=${processId}` : ''

    // handle passwordless params
    const codeParam = code ? `&code=${code}` : ''
    const emailParam = email ? `&email=${encodeURIComponent(email)}` : ''
    const phoneParam = phone ? `&phone=${encodeURIComponent(phone)}` : '' // if user passes in +12103334444, the plus sign needs to be URL encoded

    const returnAccessTokenParam = returnAccessToken ? `&return_access_token=${returnAccessToken}` : ''
    const returnIdTokenParam = returnIdToken ? `&return_id_token=${returnIdToken}` : ''

    const url =
      `${oreIdUrl}/auth#provider=${provider}` +
      `${codeParam}${emailParam}${phoneParam}` +
      `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(
        backgroundColor,
      )}${linkToAccountParam}${encodedStateParam}${processIdParam}${returnAccessTokenParam}${returnIdTokenParam}`

    return this.addAccessTokenAndHmacToUrl(url, null)
  }

  /** Returns a fully formed url to call the sign endpoint
    chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin', 'ore_main', 'eos_test', etc. */
  async getOreIdSignUrl(signOptions: SignOptions) {
    const {
      account,
      allowChainAccountSelection,
      broadcast,
      callbackUrl,
      chainNetwork,
      expireSeconds,
      multiSigChainAccounts,
      processId,
      provider,
      returnSignedTransaction,
      signedTransaction,
      state,
      transaction,
      transactionRecordId,
      userPassword,
    } = signOptions
    let { chainAccount } = signOptions
    const { oreIdUrl } = this.options
    // Now always appends accessToken to signUrl
    const { accessToken } = this
    if (!account || !callbackUrl || (!transaction && !signedTransaction)) {
      throw new Error('Missing a required parameter')
    }

    // default chainAccount is the same as the user's account
    if (!chainAccount) {
      chainAccount = account
    }

    const encodedTransaction = Helpers.base64Encode(transaction)
    const encodedSignedTransaction = Helpers.base64Encode(signedTransaction)
    let optionalParams = state ? `&state=${state}` : ''
    optionalParams += !isNullOrEmpty(transaction) ? `&transaction=${encodedTransaction}` : ''
    optionalParams += !isNullOrEmpty(signedTransaction) ? `&signed_transaction=${encodedSignedTransaction}` : ''
    optionalParams += !isNullOrEmpty(allowChainAccountSelection)
      ? `&allow_chain_account_selection=${allowChainAccountSelection}`
      : ''
    optionalParams += !isNullOrEmpty(expireSeconds) ? `&expire_seconds=${expireSeconds}` : ''
    optionalParams += !isNullOrEmpty(multiSigChainAccounts) ? `&multisig_chain_accounts=${multiSigChainAccounts}` : ''
    optionalParams += !isNullOrEmpty(provider) ? `&provider=${provider}` : ''
    optionalParams += !isNullOrEmpty(returnSignedTransaction)
      ? `&return_signed_transaction=${returnSignedTransaction}`
      : ''
    optionalParams += !isNullOrEmpty(transactionRecordId) ? `&transaction_record_id=${transactionRecordId}` : ''
    optionalParams += !isNullOrEmpty(processId) ? `&process_id=${processId}` : ''
    optionalParams += !isNullOrEmpty(accessToken) ? `&oauth_access_token=${accessToken}` : ''

    // prettier-ignore
    const url = `${oreIdUrl}/sign#account=${account}&broadcast=${broadcast}&callback_url=${encodeURIComponent(callbackUrl)}&chain_account=${chainAccount}&chain_network=${encodeURIComponent(chainNetwork)}${optionalParams}`
    return this.addAccessTokenAndHmacToUrl(url, null)
  }

  /** Returns a fully formed url to call the auth endpoint */
  async getRecoverAccountUrl(args: GetOreIdRecoverAccountUrlParams): Promise<GetRecoverAccountUrlResult> {
    const {
      account,
      code,
      email,
      phone,
      provider,
      callbackUrl,
      backgroundColor,
      state,
      recoverAction,
      processId,
      overrideAppAccessToken,
    } = args
    const { oreIdUrl } = this.options

    if (!provider || !callbackUrl) {
      throw new Error('Missing a required parameter')
    }

    // optional params
    const encodedStateParam = state ? `&state=${state}` : ''
    const processIdParam = processId ? `&process_id=${processId}` : ''
    const actionTypeParam = recoverAction ? `&recover_action=${recoverAction}` : ''

    // handle passwordless params
    const codeParam = code ? `&code=${code}` : ''
    const emailParam = email ? `&email=${encodeURIComponent(email)}` : ''
    const phoneParam = phone ? `&phone=${encodeURIComponent(phone)}` : '' // if user passes in +12103334444, the plus sign needs to be URL encoded

    const url =
      `${oreIdUrl}/recover-account#provider=${provider}` +
      `&account=${account}` +
      `${codeParam}${emailParam}${phoneParam}` +
      `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(
        backgroundColor,
      )}${actionTypeParam}${encodedStateParam}${processIdParam}`

    return this.addAccessTokenAndHmacToUrl(url, null, overrideAppAccessToken)
  }

  /** Extracts the response parameters on the /auth callback URL string */
  handleAuthResponse(callbackUrlString: string): AuthResponse {
    // Parses error codes and returns an errors array
    // (if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
    const {
      access_token: accessToken,
      account,
      id_token: idToken,
      process_id: processId,
      state,
      errors,
    } = Helpers.extractDataFromCallbackUrl(callbackUrlString)
    const response: any = { account }
    if (idToken) response.idToken = idToken
    if (errors) response.errors = errors
    if (processId) response.processId = processId
    if (state) response.state = state
    if (accessToken) {
      response.accessToken = accessToken
      this.accessToken = accessToken // sets access token state
    }
    this.setIsBusy(false)
    return response
  }

  /** Extracts the response parameters on the /new-account callback URL string */
  handleNewAccountResponse(callbackUrlString: string): NewAccountResponse {
    const { chain_account: chainAccount, process_id: processId, state, errors } = Helpers.extractDataFromCallbackUrl(
      callbackUrlString,
    )
    this.setIsBusy(false)
    return { chainAccount, processId, state, errors }
  }

  /** Extracts the response parameters on the /sign callback URL string */
  handleSignResponse(callbackUrlString: string): SignResponse {
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
  async getConfigFromApi(configType: Config.Chains, processId: ProcessId = null) {
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

  isCustodial(provider: AuthProvider) {
    return provider === AuthProvider.Custodial
  }

  getWalletProviderInfo(provider: AuthProvider, type: ExternalWalletInterface) {
    if (!provider || !type) {
      return {
        transitProviderAttributes: transitProviderAttributesData,
      }
    }

    if (type === ExternalWalletInterface.Transit) {
      return getTransitProviderAttributes(provider)
    }

    return null
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
