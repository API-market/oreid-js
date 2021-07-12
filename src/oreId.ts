/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios'
import { initAccessContext, WalletProvider, Wallet } from '@aikon/eos-transit'
import { msgPackEncode } from './chainUtils'
import Helpers from './helpers'
import LocalState from './localState'
import { defaultOreIdServiceUrl, providersNotImplemented, version } from './constants'
import { generateHmac } from './hmac'
import {
  getTransitProviderAttributes,
  getTransitProviderAttributesByProviderId,
  supportedTransitProviders,
  transitProviderAttributesData,
} from './transitProviders'
import {
  getUALProviderAttributes,
  getUALProviderAttributesByUALName,
  supportedUALProviders,
  ualProviderAttributesData,
} from './ualProviders'
import {
  ApiEndpoint,
  GetNewAppAccessTokenParams,
  TransitWalletAccessContext,
  OreIdOptions,
  AppAccessToken,
  AppAccessTokenMetadata,
  ChainNetwork,
  SettingChainNetwork,
  PasswordlessApiParams,
  LoginOptions,
  AuthResponse,
  SignResponse,
  ProcessId,
  SignOptions,
  SignTransactionApiBodyParams,
  AuthProvider,
  SignStringParams,
  TransitWallet,
  AccountName,
  PermissionName,
  ChainAccount,
  PublicKey,
  WalletPermission,
  GetOreIdAuthUrlParams,
  ExternalWalletInterface,
  ConnectToTransitProviderParams,
  ConnectToUalProviderParams,
  CustodialNewAccountApiBodyParams,
  CustodialNewAccountParams,
  CustodialMigrateAccountApiBodyParams,
  CustodialMigrateAccountParams,
  SetupTransitWalletParams,
  GetAccessTokenParams,
  Config,
  TransitAccountInfo,
  RequestType,
  AddPermissionParams,
  DiscoverOptions,
  SignWithOreIdReturn,
  SignatureProviderArgs,
  ChainPlatformType,
  TransitDiscoveryOptions,
  NewAccountOptions,
  NewAccountResponse,
  GetOreIdNewAccountUrlParams,
  GetOreIdRecoverAccountUrlParams,
  ConvertOauthTokensParams,
  ConvertOauthTokensApiBodyParams,
} from './types'

const { isNullOrEmpty } = Helpers

export default class OreId {
  constructor(options: OreIdOptions) {
    this.options = null
    this.appAccessToken = null
    this.localState = new LocalState(options)
    this.transitAccessContexts = {}
    this.cachedChainNetworks = null

    this.validateOptions(options)
    this.assertNoDuplicateProviders()
  }

  isBusy: boolean

  options: OreIdOptions

  appAccessToken: AppAccessToken

  localState: LocalState

  transitAccessContexts: { [key: string]: TransitWalletAccessContext }

  cachedChainNetworks: SettingChainNetwork[] = []

  /** whether the current appId is a demo app */
  get isDemoApp() {
    return this.options?.appId?.toLowerCase().startsWith('demo') || false
  }

  // If we're running in the browser, we must use a proxy server to talk to OREID api
  // Unless, we are running the demo app, in which case CORS is disabled by OREID server
  get requiresProxyServer() {
    return Helpers.isInBrowser && !this.isDemoApp
  }

  /** compare id of EosTransitProviders and UALProviders and throw if any duplicates exist */
  /** Names of all Transit providers installed (provided to this constructor) */
  transitProvidersInstalled: AuthProvider[] = []

  /** Names of all UALProviders installed (provided to this constructor) */
  ualProvidersInstalled: AuthProvider[] = []

  /** Compare EosTransitProviders installed with UALProviders installed - throw if duplicates exist
   *  Note: This function maps both types of providers to the same AuthProvider name
   */
  async assertNoDuplicateProviders() {
    const { ualProviders, eosTransitWalletProviders } = this.options
    // All installed TransitProviders
    this.transitProvidersInstalled = (eosTransitWalletProviders || [])
      .map(makeWalletProvider => {
        try {
          // if there is an error while initiating a provider dont break the whole process.
          return makeWalletProvider(null)
        } catch (e) {
          console.log(`Couldn't initiate a wallet provider. ${e}`)
          return null
        }
      }) // instantiate the provider with null network so we can get the id
      .filter(walletProvider => walletProvider && true)
      .map(walletProvider => {
        return getTransitProviderAttributesByProviderId(walletProvider.id).providerName
      })
    // All installed UALProviders
    this.ualProvidersInstalled = (ualProviders || []).map(
      ualProvider => getUALProviderAttributesByUALName(ualProvider.name).providerName,
    )
    // Check for duplicate providers
    if (!isNullOrEmpty(eosTransitWalletProviders) && !isNullOrEmpty(ualProviders)) {
      const duplicates = [...new Set(this.transitProvidersInstalled.filter(transit => this.hasUALProvider(transit)))]
      if (!isNullOrEmpty(duplicates)) {
        throw Error(
          `Duplicate providers found for the same wallet provider(s) -> ${duplicates}. Please remove either the EosTransit or UAL provider.`,
        )
      }
    }
  }

  /** Throw if the required plug-in is not installed */
  assertHasProviderInstalled(provider: AuthProvider, providerType: ExternalWalletInterface) {
    if (providerType === ExternalWalletInterface.Ual) {
      if (!this.hasUALProvider(provider)) {
        throw Error(`UAL provider ${provider} not installed. Please pass it in via ualProviders.`)
      }
    } else if (providerType === ExternalWalletInterface.Transit) {
      if (!this.hasTransitProvider(provider)) {
        throw Error(`Transit provider ${provider} not installed. Please pass it in via eosTransitWalletProviders.`)
      }
    }
  }

  /** Throw if the provider doesnt support the specified chainNetwork */
  async assertProviderValidForChainNetwork(provider: AuthProvider, chainNetwork: ChainNetwork) {
    let chainType: ChainPlatformType
    if (this.isUALProvider(provider)) {
      chainType = getUALProviderAttributes(provider).chainType
    } else {
      chainType = getTransitProviderAttributes(provider).chainType
    }
    const networks = await this.chainNetworks()
    const isValid = !!networks.find(n => n.network === chainNetwork && n.type === chainType)
    if (!isValid) {
      throw Error(
        `Provider ${provider} doesnt support chainNetwork ${chainNetwork}. Hint: It supports networks of type ${chainType}.`,
      )
    }
  }

  /** Calls getConfigFromApi() to retrieve settings for all chain networks defined by OreID service
   * and caches the result */
  async chainNetworks() {
    if (!this.cachedChainNetworks) {
      // load the chainNetworks list from the ORE ID API
      const results = await this.getConfigFromApi(Config.Chains)
      this.cachedChainNetworks = results.chains
    }

    return this.cachedChainNetworks
  }

  /** Returns config for specified chain network */
  async getNetworkConfig(chainNetwork: ChainNetwork) {
    const networks = await this.chainNetworks()
    const chainConfig = networks.find(n => n.network === chainNetwork)
    if (!chainConfig) {
      throw new Error(`Invalid chain network: ${chainNetwork}.`)
    }
    const { hosts } = chainConfig
    const { chainId, host, port, protocol } = hosts[0] // using first host
    return { host, port, protocol, chainId }
  }

  /** Creates an EOS Transit WalletContent for the specified network and plugins
   *  Caches the context for future calls to this function */
  async getOrCreateTransitAccessContext(chainNetwork: ChainNetwork) {
    const { appName, eosTransitWalletProviders = [] } = this.options
    if (this.transitAccessContexts[chainNetwork]) {
      return this.transitAccessContexts[chainNetwork]
    }

    const networkConfig = await this.getNetworkConfig(chainNetwork)
    const isNotEosNetwork = await this.isNotEosNetwork(chainNetwork)
    const walletContext = initAccessContext({
      appName: appName || 'missing appName',
      network: networkConfig,
      walletProviders: eosTransitWalletProviders,
      isNotEosNetwork, // Tells eos-transit to not use EOS specific rpc calls
    })
    // cache for future use
    this.transitAccessContexts[chainNetwork] = walletContext
    return walletContext
  }

  async getChainNetworkSettings(chainNetwork: ChainNetwork) {
    const networks = await this.chainNetworks()
    return networks.find(n => n.network === chainNetwork)
  }

  /** Returns true if network is NOT an EOS sisterchain */
  async isNotEosNetwork(chainNetwork: ChainNetwork) {
    const networkSetting = await this.getChainNetworkSettings(chainNetwork)
    return !(networkSetting.type === ChainPlatformType.eos || networkSetting.type === ChainPlatformType.ore)
  }

  // Two paths
  // send code - params: loginType and email|phone)
  // verify code - params: loginType, email|phone, and code to check
  async callPasswordlessApi(params: PasswordlessApiParams, verify = false) {
    const { provider, phone, email, code, processId } = params

    if (!provider || !(phone || email) || (verify && !code)) {
      throw new Error('Missing a required parameter')
    }

    // Choose correct endpoint - send or verify
    let passwordlessEndpoint = ApiEndpoint.PasswordLessSendCode
    if (verify) {
      passwordlessEndpoint = ApiEndpoint.PasswordLessVerifyCode
    }

    const queryParams: PasswordlessApiParams = {
      provider,
    }

    if (email) {
      queryParams.email = encodeURIComponent(email)
    }

    if (phone) {
      // if user passes in +12103334444, the plus sign needs to be URL encoded
      queryParams.phone = encodeURIComponent(phone)
    }

    if (verify) {
      queryParams.code = code
    }

    const data = await this.callOreIdApi(RequestType.Get, passwordlessEndpoint, queryParams, processId)
    return data
  }

  // email - localhost:8080/api/account/login-passwordless-send-code?provider=email&email=me@aikon.com
  // phone - localhost:8080/api/account/login-passwordless-send-code?provider=phone&phone=+12125551212
  async passwordlessSendCodeApi(params: PasswordlessApiParams) {
    let result = {}

    try {
      result = await this.callPasswordlessApi(params)
    } catch (error) {
      return { error }
    }

    return result
  }

  // email - localhost:8080/api/account/login-passwordless-verify-code?provider=email&email=me@aikon.com&code=473830
  // phone - localhost:8080/api/account/login-passwordless-verify-code?provider=phone&phone=12125551212&code=473830
  async passwordlessVerifyCodeApi(params: PasswordlessApiParams) {
    let result = {}

    try {
      result = await this.callPasswordlessApi(params, true)
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

  async login(loginOptions: LoginOptions) {
    const { provider } = loginOptions

    if (providersNotImplemented.includes(provider)) {
      throw new Error('Not Implemented')
    }

    if (this.isUALProvider(provider) || this.isTransitProvider(provider)) {
      return this.loginWithNonOreIdProvider(loginOptions)
    }

    return this.loginWithOreId(loginOptions)
  }

  /** Sign transaction with key(s) in wallet - connect to wallet first */
  async sign(signOptions: SignOptions) {
    // handle sign transaction based on provider type
    const { provider } = signOptions

    if (providersNotImplemented.includes(provider)) {
      return null
    }

    if (this.isCustodial(provider)) {
      return this.custodialSignWithOreId(signOptions)
    }

    if (this.isUALProvider(provider) || this.isTransitProvider(provider)) {
      // this flag is added to test external signing with the PIN window in OreId service
      if (!signOptions.signExternalWithOreId) {
        return this.signWithNonOreIdProvider(signOptions)
      }
    }

    return this.signWithOreId(signOptions)
  }

  /** Discovers keys in a wallet provider.
   *  Any new keys discovered in wallet are added to user's ORE ID record.
   *  If the provider doesnt support a discover() function, and requiresLogoutLoginToDiscover == true, attempts a logout then login instead.
   */
  async discover(discoverOptions: DiscoverOptions) {
    const { provider, chainNetwork = ChainNetwork.EosMain, oreAccount, discoveryPathIndexList } = discoverOptions
    this.assertValidProvider(provider)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    let result = null

    if (this.canDiscover(provider)) {
      // UAL providers dont support discover
      result = this.discoverCredentialsInTransitWallet(chainNetwork, provider, oreAccount, discoveryPathIndexList)
    } else {
      // if provider doesn't support a discover function, we can use login to retrieve a single account/key instead
      const transitWallet = await this.setupTransitWallet({ provider, chainNetwork })
      if (this.requiresLogoutLoginToDiscover(provider)) {
        await transitWallet.logout()
        await transitWallet.login()
        this.updateOreAccountPermissionsfromTransitWalletAuth(transitWallet, provider, oreAccount)
      } else {
        console.log('Discover not working for provider: ', provider)
      }
    }

    return result
  }

  /** throw error if invalid provider */
  assertValidProvider(provider: AuthProvider) {
    if (Helpers.isInEnum(AuthProvider, provider)) {
      return true
    }
    throw new Error(`Auth provider ${provider} is not a valid option`)
  }

  async loginWithOreId(loginOptions: LoginOptions): Promise<{ loginUrl: string; errors: string }> {
    const { code, email, phone, provider, state, linkToAccount, processId, returnAccessToken, returnIdToken } =
      loginOptions || {}
    const { authCallbackUrl, backgroundColor } = this.options
    const args = {
      code,
      email,
      phone,
      provider,
      backgroundColor,
      callbackUrl: authCallbackUrl,
      state,
      linkToAccount,
      processId,
      returnAccessToken,
      returnIdToken,
    }
    const loginUrl = await this.getOreIdAuthUrl(args)
    return { loginUrl, errors: null }
  }

  async newAccountWithOreId(newAccountOptions: NewAccountOptions): Promise<{ newAccountUrl: string; errors: string }> {
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

  async checkIfTrxAutoSignable(signOptions: SignOptions) {
    const { serviceKey } = this.options
    if (!serviceKey) {
      throw new Error('Missing serviceKey in oreId config options - required to call auto-sign api endpoints.')
    }
    let autoSignCredentialsExist = false
    let processIdReturned = null
    const { account, chainAccount, chainNetwork, processId, transaction, signedTransaction } = signOptions

    const body = {
      account,
      chain_account: chainAccount,
      chain_network: chainNetwork,
      transaction: transaction ? Helpers.base64Encode(transaction) : null,
      signed_transaction: signedTransaction ? Helpers.base64Encode(signedTransaction) : null,
    }
    ;({ autoSignCredentialsExist, process_id: processIdReturned } = await this.callOreIdApi(
      RequestType.Post,
      ApiEndpoint.CanAutoSign,
      body,
      processId,
    ))

    return autoSignCredentialsExist
  }

  async callSignTransaction(signEndpoint: ApiEndpoint, signOptions: SignOptions, autoSign = false) {
    const {
      account,
      allowChainAccountSelection,
      broadcast,
      chainAccount,
      chainNetwork,
      expireSeconds,
      multiSigChainAccounts,
      processId,
      provider,
      returnSignedTransaction,
      signatureOnly,
      signedTransaction: signedTransactionParam,
      state: stateParam,
      transaction: transactionParam,
      transactionRecordId,
      userPassword,
    } = signOptions
    const body: SignTransactionApiBodyParams = {
      account,
      broadcast,
      chain_account: chainAccount,
      chain_network: chainNetwork,
      user_password: userPassword,
      signature_only: signatureOnly,
    }

    if (allowChainAccountSelection) {
      body.allow_chain_account_selection = allowChainAccountSelection
    }

    if (autoSign) {
      body.auto_sign = autoSign
    }

    if (expireSeconds) {
      body.expire_seconds = expireSeconds
    }

    if (multiSigChainAccounts) {
      body.multisig_chain_accounts = multiSigChainAccounts
    }

    if (provider) {
      body.provider = provider
    }

    if (returnSignedTransaction) {
      body.return_signed_transaction = returnSignedTransaction
    }

    if (signedTransactionParam) {
      body.signed_transaction = Helpers.base64Encode(signedTransactionParam)
    }

    if (stateParam) {
      body.transaction = Helpers.base64Encode(stateParam)
    }

    if (transactionParam) {
      body.transaction = Helpers.base64Encode(transactionParam)
    }

    if (transactionRecordId) {
      body.transaction_record_id = transactionRecordId
    }

    if (userPassword) {
      body.user_password = userPassword
    }

    const {
      signed_transaction: signedTransaction,
      transaction_id: transactionId,
      process_id: processIdReturned,
    } = await this.callOreIdApi(RequestType.Post, signEndpoint, body, processId)

    return { processId: processIdReturned, signedTransaction, transactionId }
  }

  async autoSignTransaction(signOptions: SignOptions) {
    const signEndpoint = ApiEndpoint.TransactionSign
    const { processId, signedTransaction, transactionId } = await this.callSignTransaction(
      signEndpoint,
      signOptions,
      true,
    )
    return { processId, signedTransaction, transactionId }
  }

  async signWithOreId(signOptions: SignOptions): Promise<SignWithOreIdReturn> {
    let canAutoSign = false
    // to use ORE ID to sign, we dont need to specify a login provider
    // if OreId was specified, this just means dont use an external wallet, so we remove that here
    if (signOptions?.provider === AuthProvider.OreId) {
      signOptions.provider = null
    }

    try {
      canAutoSign = await this.checkIfTrxAutoSignable(signOptions)
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

    const { processId, signedTransaction, transactionId } = await this.callSignTransaction(
      ApiEndpoint.CustodialSign,
      signOptions,
    )
    return { processId, signedTransaction, transactionId }
  }

  /** Sign an arbitrary string (instead of a transaction) */
  async signString(signOptions: SignStringParams) {
    const { provider } = signOptions
    if (!this.canSignString(provider)) {
      throw Error(`The specific provider ${provider} does not support signString`)
    }

    return this.hasUALProvider(provider)
      ? this.signStringWithUALProvider(signOptions)
      : this.signStringWithTransitProvider(signOptions)
  }

  // Supported features by provider

  /** whether discovery is supported by the provider */
  canDiscover(provider: AuthProvider) {
    if (this.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).supportsDiscovery
    }
    // UAL doesnt support this
    return false
  }

  /** whether signString is supported by the provider */
  canSignString(provider: AuthProvider) {
    if (this.hasUALProvider(provider)) {
      return getUALProviderAttributes(provider).supportsSignArbitrary
    }
    if (this.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).supportsSignArbitrary
    }
    return false
  }

  /** whether call to discover is required by provider before login */
  requiresDiscoverToLogin(provider: AuthProvider) {
    if (this.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).requiresDiscoverToLogin
    }
    // UAL doesnt support this
    return false
  }

  /** whether call to logout then login is required by provider before discover */
  requiresLogoutLoginToDiscover(provider: AuthProvider) {
    if (this.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).requiresLogoutLoginToDiscover
    }
    // UAL doesnt support this
    return false
  }

  /** default path index for provider (if any) */
  defaultDiscoveryPathIndexList(provider: AuthProvider): number[] {
    if (this.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider)?.defaultDiscoveryPathIndexList
    }
    // UAL doesnt support this
    return null
  }

  /** help text displayed to user for provider */
  helpTextForProvider(provider: AuthProvider) {
    if (this.hasTransitProvider(provider)) {
      return getTransitProviderAttributes(provider).helpText
    }

    if (this.hasUALProvider(provider)) {
      return getUALProviderAttributes(provider).helpText
    }

    return null
  }

  /** Discover options composed for specific provider */
  discoverOptionsForProvider(provider: AuthProvider, pathIndexListParam: number[] = null): TransitDiscoveryOptions {
    let pathIndexList
    let keyLookupFunc
    if (this.hasTransitProvider(provider)) {
      const { defaultDiscoveryPathIndexList, discoveryKeyLookupFunc } = getTransitProviderAttributes(provider)
      pathIndexList = pathIndexListParam || defaultDiscoveryPathIndexList || []
      keyLookupFunc = discoveryKeyLookupFunc // optional
    }

    const response: TransitDiscoveryOptions = { pathIndexList }
    if (keyLookupFunc) {
      response.keyLookupFunc = keyLookupFunc
    }

    return response
  }

  /** Signs an arbitrary string using a specific provider */
  async signStringWithUALProvider({ provider, chainNetwork, string, chainAccount, message }: SignStringParams) {
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    const { user } = await this.connectToUALProvider({ provider, chainNetwork, chainAccount })
    try {
      this.setIsBusy(true)
      const keys = await user.getKeys()
      const response = await user.signArbitrary(keys[0], string, message)
      return { signedString: response }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.setIsBusy(false)
    }
  }

  async signStringWithTransitProvider({ provider, chainNetwork, string, message }: SignStringParams) {
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    const { transitWallet } = await this.connectToTransitProvider({ provider, chainNetwork })
    try {
      this.setIsBusy(true)
      const response = await transitWallet.signArbitrary(string, message)
      return { signedString: response }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.setIsBusy(false)
    }
  }

  /** sign with a wallet via UAL or Transit */
  async signWithNonOreIdProvider(signOptions: SignOptions) {
    const isUALProvider = this.isUALProvider(signOptions.provider)
    return isUALProvider ? this.signWithUALProvider(signOptions) : this.signWithTransitProvider(signOptions)
  }

  /** sign with a UAL wallet */
  async signWithUALProvider(signOptions: SignOptions) {
    const { provider, broadcast, chainNetwork, transaction, chainAccount } = signOptions
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    const { user } = await this.connectToUALProvider({ provider, chainNetwork, chainAccount })
    try {
      this.setIsBusy(true)
      const response = await user.signTransaction({ actions: [transaction] }, { broadcast })
      return { signedTransaction: response }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.setIsBusy(false)
    }
  }

  /** sign with a Transit wallet */
  async signWithTransitProvider(signOptions: SignOptions) {
    let signedTransaction
    const { chainNetwork, chainAccount, provider } = signOptions
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    // connect to wallet
    const { transitWallet } = await this.connectToTransitProvider({ provider, chainNetwork, chainAccount })

    try {
      // sign with transit wallet
      this.setIsBusy(true)
      const { chainType } = getTransitProviderAttributes(provider)
      // EOS - use eosJS to sign (eosApi.transact)
      if (chainType === ChainPlatformType.eos) {
        signedTransaction = await this.signTransactionWithTransitAndEosSDK(signOptions, transitWallet)
      } else if (chainType === ChainPlatformType.algorand) {
        // Other chains - use sign function on walletProvider
        signedTransaction = await this.signTransactionWithTransitAndAlgorandSDK(signOptions, transitWallet)
      } else if (chainType === ChainPlatformType.ethereum) {
        // Ethereum - use sign function on ethereum walletProvider
        signedTransaction = await this.signTransactionWithTransitAndEthereumSDK(signOptions, transitWallet)
      } else {
        throw new Error(`signWithTransitProvider doesnt support chain type: ${chainType}`)
      }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this.setIsBusy(false)
    }

    return { signedTransaction }
  }

  /** sign transaction using EOS SDK .transact function */
  private async signTransactionWithTransitAndEosSDK(signOptions: SignOptions, transitWallet: Wallet) {
    const { broadcast, expireSeconds, transaction } = signOptions
    const { signatures, serializedTransaction } = await transitWallet.eosApi.transact(
      {
        actions: [transaction],
      },
      {
        broadcast,
        blocksBehind: 3,
        expireSeconds: expireSeconds || 60,
      },
    )
    return { signatures, serializedTransaction }
  }

  /** sign transaction using Algorand SDK */
  private async signTransactionWithTransitAndAlgorandSDK(signOptions: SignOptions, transitWallet: Wallet) {
    const { chainNetwork, transaction } = signOptions
    // Other chains - use sign function on walletProvider
    const networkConfig = await this.getNetworkConfig(chainNetwork)
    const signParams: SignatureProviderArgs = {
      chainId: networkConfig.chainId, // Chain transaction is for
      requiredKeys: null, // not used by Algorand signatureProvider
      serializedTransaction: msgPackEncode(transaction), // Transaction to sign
      abis: null, // not used by Algorand signatureProvider
    }
    const { signatures, serializedTransaction } = await transitWallet.provider.signatureProvider.sign(signParams)
    return { signatures, serializedTransaction }
  }

  /** sign transaction using ethereum web3 SDK */
  private async signTransactionWithTransitAndEthereumSDK(signOptions: SignOptions, transitWallet: Wallet) {
    const { chainNetwork, transaction } = signOptions
    // Other chains - use sign function on walletProvider
    const networkConfig = await this.getNetworkConfig(chainNetwork)

    const signParams: SignatureProviderArgs = {
      chainId: networkConfig.chainId, // Chain transaction is for
      requiredKeys: null, // not used by Ethereum signatureProvider
      serializedTransaction: msgPackEncode(transaction), // Transaction to sign
      abis: null, // not used by Ethereum signatureProvider
    }
    const { signatures, serializedTransaction } = await transitWallet.provider.signatureProvider.sign(signParams)
    return { signatures, serializedTransaction }
  }

  /** create a new user account that is managed by your app
   * this requires a wallet password (userPassword) on behalf of the user */
  async custodialNewAccount(accountOptions: CustodialNewAccountParams) {
    const { serviceKey } = this.options
    const { accountType, email, idToken, name, picture, phone, userName, userPassword, processId } = accountOptions
    const body: CustodialNewAccountApiBodyParams = {
      account_type: accountType,
      email,
      id_token: idToken,
      name,
      phone,
      picture,
      user_name: userName,
      user_password: userPassword,
    }
    if (!serviceKey) {
      throw new Error('Missing serviceKey in oreId config options - required to call api/custodial/new-user.')
    }

    const data = await this.callOreIdApi(RequestType.Post, ApiEndpoint.CustodialNewAccount, body, processId)

    return data
  }

  /** Call the migrate-account api
   * This migrates a virtual account to a native account (on-chain)
   * This endpoint expects the account to be a managed (custodial) account
   * ... it requires you to provide a wallet password (userPassword) on behalf of the user */
  async custodialMigrateAccount(migrateOptions: CustodialMigrateAccountParams) {
    const { serviceKey } = this.options
    if (!serviceKey) {
      throw new Error('Missing serviceKey in oreId config options - required to call api/custodial/migrate-account.')
    }

    const { account, chainAccount, chainNetwork, processId, toType, userPassword } = migrateOptions
    const body: CustodialMigrateAccountApiBodyParams = {
      account,
      chain_account: chainAccount,
      chain_network: chainNetwork,
      to_type: toType,
      user_password: userPassword,
    }

    const { account: newAccount, process_id: processIdReturned } = await this.callOreIdApi(
      RequestType.Post,
      ApiEndpoint.CustodialMigrateAccount,
      body,
      processId,
    )

    return { account: newAccount, processId: processIdReturned }
  }

  /** Call the account/convert-oauth api
   * Converts OAuth tokens from some 3rd-party source to OREID Oauth tokens
   * The third-party (e.g. Auth0 or Google) must be registered in the AppRegistration.oauthSettings */
  async convertOauthTokens(oauthOptions: ConvertOauthTokensParams) {
    const body: ConvertOauthTokensApiBodyParams = {
      access_token: oauthOptions?.accessToken,
      id_token: oauthOptions?.idToken,
    }

    const { accessToken, idToken, processId: processIdReturned } = await this.callOreIdApi(
      RequestType.Post,
      ApiEndpoint.ConvertOauthTokens,
      body,
      oauthOptions?.processId,
    )

    return { accessToken, idToken, processId: processIdReturned }
  }

  /** Login using the wallet provider */
  async loginWithNonOreIdProvider(loginOptions: LoginOptions) {
    const { provider, chainAccount, chainNetwork } = loginOptions
    let response
    let wallet
    // Connect to Provider
    if (this.hasUALProvider(provider)) {
      response = await this.connectToUALProvider({ provider, chainAccount, chainNetwork })
      wallet = response.wallet
    } else {
      response = await this.connectToTransitProvider({ provider, chainAccount, chainNetwork })
      wallet = response.transitWallet
    }
    // Login if needed - if not logged-in by connectToTransitProvider, then call login explicitly
    if (!wallet.auth) {
      if (this.hasUALProvider(provider)) {
        await this.loginToUALProvider(wallet, provider, chainNetwork, chainAccount)
      } else {
        await this.loginToTransitProvider(wallet, provider, chainNetwork, chainAccount)
      }
      await this.updateOreAccountPermissionsfromTransitWalletAuth(wallet, provider, null)
    }
    return response
  }

  // TODO: type wallet
  async loginToUALProvider(
    provider: AuthProvider,
    wallet: any,
    chainNetwork: ChainNetwork,
    chainAccount: ChainAccount,
  ) {
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    try {
      const users = await wallet.login(chainAccount)
      return users
    } catch (error) {
      const { message = '' } = error
      if (message.includes('unknown key (boost::tuples::tuple')) {
        throw new Error(`The account selected by the wallet for login isn't on the ${chainNetwork} chain`)
      } else {
        throw error
      }
    }
  }

  // TODO: We should cache the wallet/user object to avoid calling login everytime we need to sign
  async connectToUALProvider({
    provider,
    chainNetwork = ChainNetwork.EosMain,
    chainAccount = '',
  }: ConnectToUalProviderParams) {
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    const SelectedProvider = this.options.ualProviders.find(ualProvider => ualProvider.name.toLowerCase() === provider)
    if (SelectedProvider) {
      try {
        const networkConfig = await this.getNetworkConfig(chainNetwork)
        const ualNetworkConfig = {
          chainId: networkConfig.chainId,
          rpcEndpoints: [
            {
              ...networkConfig,
            },
          ],
        }
        const wallet = new SelectedProvider([ualNetworkConfig], { appName: this.options.appName })
        await wallet.init()
        const users = await this.loginToUALProvider(provider, wallet, chainNetwork, chainAccount)

        if (!isNullOrEmpty(users)) {
          // TODO: Handle multiple users/permissions
          // UAL doesn't return the permission so we default to active
          const user = users[0]
          const publicKeys = await user.getKeys()
          const account = await user.getAccountName()
          const permissions = [{ name: 'active', publicKey: publicKeys[0] }]
          const response = {
            isLoggedIn: true,
            account,
            permissions,
            provider,
            wallet,
            user,
          }

          // get the chainNetwork from the UALProvider since we cant tell it what network to use
          const chainNetworkFromProvider = await this.getChainNetworkByChainId(ualNetworkConfig.chainId)
          if (chainNetworkFromProvider) {
            await this.updatePermissionsIfNecessary(account, permissions, chainNetworkFromProvider, provider)
          }

          return response
        }
      } catch (error) {
        console.log(`connectToUALProvider: Failed to connect to ${provider}: ${error?.message}`, error)
        throw error
      }
    } else {
      throw Error('Provider does not match')
    }
    return null
  }

  findAccountInDiscoverData(discoveryData: any, chainAccount: ChainAccount) {
    const result = discoveryData.keyToAccountMap.find((data: any) => {
      return data.accounts.find((acct: any) => {
        return acct.account === chainAccount
      })
    })

    if (result) {
      let authorization = 'active'

      // could active not exist?  If not, then just get first permission
      // this may be completely unecessary. remove if so.
      const active = result.accounts.find((acct: any) => {
        return acct.authorization === 'active'
      })

      if (!active) {
        const [first] = result.accounts

        if (first) {
          authorization = first.authorization
        }
      }

      return { index: result.index, key: result.key, authorization }
    }

    return null
  }

  // This seems like a hack, but eos-transit only works if it's done this way
  // if you have scatter for example and you login with an account, the next time you login
  // no matter what you pass to login(), you will be logged in to that account
  // you have to logout first. But you don't want to logout unless the first account isn't the right one,
  // otherwise the user would have to login everytime.
  // the user in scatter has to make sure they pick the correct account when the login window comes up
  // this should be simpler, maybe will be resolved in a future eos-transit
  /** Handles the call to login() function on the Transit provider
   *  If required by provider, calls discover() and/or logout() before calling login()
   *  IMPORTANT: use loginToTransitProvider() instead of this function */
  async doTransitProviderLogin(
    transitWallet: TransitWallet,
    chainAccount: ChainAccount,
    chainNetwork: ChainNetwork,
    provider: AuthProvider,
    retryCount = 0,
  ) {
    let info: TransitAccountInfo
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    // we should store the index for ledger in the db and pass it along
    // but for now we need to discover the ledger index
    const { requiresDiscoverToLogin } = getTransitProviderAttributes(provider)
    if (requiresDiscoverToLogin) {
      // we have to discover on ledger since we don't know the index of the account
      //
      const discoveryData = await transitWallet.discover(this.discoverOptionsForProvider(provider))
      const foundData = this.findAccountInDiscoverData(discoveryData, chainAccount)
      if (foundData) {
        info = await transitWallet.login(chainAccount, foundData.authorization)
      } else {
        throw new Error(`Account ${chainAccount} not found in wallet`)
      }
    } else {
      info = await transitWallet.login(chainAccount)
    }

    if (retryCount > 2) {
      // don't get stuck in a loop, let the transaction fail so the user will figure it out
      return
    }

    const { accountName: transitAccountName } = transitWallet?.auth || {}

    if (chainAccount && transitAccountName !== chainAccount) {
      // keep trying until the user logs in with the correct wallet
      // in scatter, it will ask you to choose an account if you logout and log back in
      // we could also call discover and login to the matching account and that would avoid a step
      await transitWallet.logout()
      this.doTransitProviderLogin(transitWallet, chainAccount, chainNetwork, provider, retryCount + 1)
    }
  }

  /** Handles the call to login() function on the Transit provider */
  async loginToTransitProvider(
    transitWallet: TransitWallet,
    provider: AuthProvider,
    chainNetwork: ChainNetwork,
    chainAccount: ChainAccount = null,
  ) {
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    try {
      // if the default login is for a different account
      await this.doTransitProviderLogin(transitWallet, chainAccount, chainNetwork, provider)
    } catch (error) {
      const { message = '' } = error
      if (message.includes('unknown key (boost::tuples::tuple')) {
        throw new Error(`The account selected by the wallet for login isn't on the ${chainNetwork} chain`)
      } else {
        throw error
      }
    } finally {
      await this.waitWhileWalletIsBusy(transitWallet, provider)
    }
  }

  /** Inialize EOS Transit wallet provider and return TransitWallet instance */
  async setupTransitWallet({ provider, chainNetwork }: SetupTransitWalletParams): Promise<TransitWallet> {
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    const { providerId } = getTransitProviderAttributes(provider)
    const chainContext = await this.getOrCreateTransitAccessContext(chainNetwork)
    const transitProvider = chainContext.getWalletProviders().find(wp => wp.id === providerId)
    const transitWallet = chainContext.initWallet(transitProvider)
    try {
      await transitWallet.connect()
      await this.waitWhileWalletIsBusy(transitWallet, provider)
      return transitWallet
    } catch (error) {
      console.log(`setupTransitWallet: Failed to connect to ${provider} wallet: ${error?.message}`, error)
      throw error
    }
  }

  /** Add the account selected in the transitWallet to the ORE account's list of account/permissions */
  async updateOreAccountPermissionsfromTransitWalletAuth(
    transitWallet: TransitWallet,
    provider: AuthProvider,
    oreAccount: AccountName = null,
  ) {
    if (!transitWallet?.connected || !transitWallet?.auth) {
      return
    }
    const { accountName, permission, publicKey } = transitWallet.auth
    // abort silently if account is missing some info - some chains/wallets (e.g. ethereum) dont provide the public key, so we can't add the perm here
    if (!accountName || !permission || !publicKey) {
      return
    }
    const permissions: WalletPermission[] = [{ name: permission, publicKey }] // todo: add parent permission when available
    // Get the chainNetwork from the transitWallet - in case the wallet provider switches networks somehow
    const transitChainNetwork = await this.getChainNetworkFromTransitWallet(transitWallet)
    if (transitChainNetwork) {
      await this.updatePermissionsIfNecessary(accountName, permissions, transitChainNetwork, provider, oreAccount)
    }
  }

  // chainAccount is needed since login will try to use the default account (in scatter)
  // and it wil fail to sign the transaction
  async connectToTransitProvider({
    provider,
    chainNetwork = ChainNetwork.EosMain,
    chainAccount = null,
  }: ConnectToTransitProviderParams): Promise<{ transitWallet: TransitWallet }> {
    let response: any
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    try {
      const transitWallet: TransitWallet = await this.setupTransitWallet({ provider, chainNetwork })
      response = { transitWallet }
      // some providers require login flow to connect (usually this means connect() does nothing but login selects an account)
      if (getTransitProviderAttributes(provider).requiresLogin) {
        // if connected, but not authenticated, then login
        if (!transitWallet.authenticated) {
          await this.loginToTransitProvider(transitWallet, provider, chainNetwork, chainAccount)
        }
      }

      // If connecting also performs login
      // return login results or throw error
      if (transitWallet.connected) {
        // if wallet has an account (by logging in), add it to OREID account add account info to response
        if (transitWallet.authenticated && transitWallet.auth) {
          await this.updateOreAccountPermissionsfromTransitWalletAuth(transitWallet, provider, null)
          const { accountName, permission, publicKey } = transitWallet.auth
          response = {
            isLoggedIn: true,
            account: accountName,
            permissions: [{ name: permission, publicKey }], // todo: add parent permission when available
            transitWallet,
            provider,
          }
        }
      } else {
        let errorString = `${provider} not connected!`
        const { hasError, errorMessage } = transitWallet
        if (hasError) {
          errorString += ` Error: ${errorMessage}`
        }
        throw new Error(errorString)
      }
    } catch (error) {
      const errMsg = `connectToTransitProvider: Failed to connect to ${provider} on ${chainNetwork}: ${error?.message}`
      console.log(errMsg, error)
      throw error
    } finally {
      this.setIsBusy(false)
    }

    return response
  }

  async waitWhileWalletIsBusy(transitWallet: TransitWallet, provider: AuthProvider) {
    while (transitWallet.inProgress) {
      this.setIsBusy(true)
      // todo: add timeout
      // eslint-disable-next-line no-await-in-loop
      await Helpers.sleep(250)
      console.log(`connecting to ${provider} via eos-transit wallet in progress:`, transitWallet.inProgress)
    }
    this.setIsBusy(false)
  }

  async getChainNetworkByChainId(chainId: string) {
    const networks = await this.chainNetworks()
    const chainConfig = networks.find(n => n.hosts.find(h => h.chainId === chainId))

    if (!isNullOrEmpty(chainConfig)) {
      return chainConfig.network
    }
    return null
  }

  /** Determine the chainNetwork from the transitWallet context */
  async getChainNetworkFromTransitWallet(transitWallet: TransitWallet) {
    const { chainId } = transitWallet?.ctx?.network
    if (!chainId) {
      return null
    }
    const networks = await this.chainNetworks()
    return networks.find(net => net.hosts.find(host => host.chainId === chainId))?.network
  }

  /** Discover all accounts (and related permissions) in the wallet and add them to ORE ID
   * Note: Most wallets don't support discovery */
  async discoverCredentialsInTransitWallet(
    chainNetwork: ChainNetwork,
    provider: AuthProvider,
    oreAccount: AccountName,
    discoveryPathIndexList: number[],
  ) {
    let accountsAndPermissions: WalletPermission[] = []

    try {
      const transitWallet = await this.setupTransitWallet({ provider, chainNetwork })

      this.setIsBusy(true)
      const discoveryData = await transitWallet.discover(
        this.discoverOptionsForProvider(provider, discoveryPathIndexList),
      )

      // this data looks like this: keyToAccountMap[accounts[{account,permission}]] - e.g. keyToAccountMap[accounts[{'myaccount':'owner','myaccount':'active'}]]
      const credentials = discoveryData.keyToAccountMap

      for (let i = 0; i < credentials.length; i += 1) {
        const credential = credentials[i]

        const { accounts = [] } = credential
        if (accounts.length > 0) {
          const { account, authorization } = accounts[0]
          const permissions: WalletPermission[] = [
            {
              account,
              publicKey: credential.key,
              name: authorization,
              parent: null,
            },
          ]
          // Get the chainNetwork from the transitWallet - in case the wallet provider switches networks somehow
          // eslint-disable-next-line no-await-in-loop
          const transitChainNetwork = await this.getChainNetworkFromTransitWallet(transitWallet)
          // eslint-disable-next-line no-await-in-loop
          await this.addWalletPermissionsToOreIdAccount(account, transitChainNetwork, permissions, oreAccount, provider)
          accountsAndPermissions = accountsAndPermissions.concat(permissions)
        }
      }
    } finally {
      this.setIsBusy(false)
    }
    // return a list of account names and related permissions found
    return accountsAndPermissions
  }

  setIsBusy(value: boolean) {
    if (this.isBusy !== value) {
      this.isBusy = value
      if (this.options.setBusyCallback) {
        this.options.setBusyCallback(value)
      }
    }
  }

  /** Helper function to update permissions for oreAccount in OreID service
   *  If oreAccount is not provide, we'll use the local state value for it for the logged in user
   */
  async updatePermissionsIfNecessary(
    chainAccount: ChainAccount,
    permissions: WalletPermission[],
    chainNetwork: ChainNetwork,
    provider: AuthProvider,
    oreAccount: AccountName = null,
  ) {
    // use logged-in account if missing oreAccount param
    const oreAcct = oreAccount || this.localState.accountName()

    if (oreAcct) {
      await this.addWalletPermissionsToOreIdAccount(chainAccount, chainNetwork, permissions, oreAcct, provider)
    } else {
      console.log('updatePermissionsIfNecessary: oreAccount is null')
    }
  }

  // for each permission in the wallet, add to ORE ID (if not in user's record)
  async addWalletPermissionsToOreIdAccount(
    chainAccount: ChainAccount,
    chainNetwork: ChainNetwork,
    walletPermissions: WalletPermission[],
    oreAccount: AccountName,
    provider: AuthProvider,
  ) {
    if (isNullOrEmpty(oreAccount) || isNullOrEmpty(walletPermissions) || isNullOrEmpty(chainNetwork)) {
      return
    }

    const theUser = await this.getUser(oreAccount, true)

    await walletPermissions.map(async p => {
      const permission = p.name
      let parentPermission = p.parent
      if (!parentPermission) {
        // HACK: assume parent permission - its missing from the discover() results
        parentPermission = 'active'

        if (permission === 'owner') {
          parentPermission = ''
        } else if (permission === 'active') {
          parentPermission = 'owner'
        }
      }
      // filter out permission that the user already has in his record
      const skipThisPermission = theUser.permissions.some(
        up =>
          (up.chainAccount === chainAccount && up.chainNetwork === chainNetwork && up.permission === permission) ||
          permission === 'owner',
      )

      // don't add 'owner' permission and skip ones that are already stored in user's account
      if (skipThisPermission !== true) {
        // let publicKey = p.required_auth.keys[0].key; //TODO: Handle multiple keys and weights
        const { publicKey } = p
        // if call is successful, nothing is returned in response (except processId)
        await this.addPermission(
          oreAccount,
          chainAccount,
          chainNetwork,
          publicKey,
          parentPermission,
          permission,
          provider,
        )
      }
    })

    // reload user to get updated permissions
    await this.getUser(oreAccount, true)
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

  // load user from local storage and call api
  // to get latest info, pass refresh = true
  async getUser(accountName: AccountName = null, refresh = false, processId: ProcessId = null) {
    // return the cached user if we have it and matches the accountName
    if (!refresh) {
      const cachedUser = this.localState.user()
      if (!isNullOrEmpty(cachedUser)) {
        if (!isNullOrEmpty(accountName)) {
          if (cachedUser.accountName === accountName) {
            return cachedUser
          }
        } else {
          return cachedUser
        }
      }
    }

    // stores user in the local state, we must await for return below to work
    // this function does nothing if accoutName is null
    await this.getUserInfoFromApi(accountName, processId)

    return this.localState.user()
  }

  // Loads settings value from the server
  // e.g. configType='chains' returns valid chain types and addresses
  async getConfig(configType: Config, processId: ProcessId = null) {
    return this.getConfigFromApi(configType, processId)
  }

  // Gets a single-use token to access the service
  async getAccessToken({ appAccessTokenMetadata, processId }: GetAccessTokenParams = {}) {
    await this.getNewAppAccessToken({ appAccessTokenMetadata, processId }) // call api
    return this.appAccessToken
  }

  // Returns a fully formed url to call the new-account endpoint
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

    const url =
      `${oreIdUrl}/new-account#provider=${provider}&chain_network=${chainNetwork}` +
      `&callback_url=${encodeURIComponent(callbackUrl)}&background_color=${encodeURIComponent(
        backgroundColor,
      )}${encodedStateParam}${processIdParam}`
    return this.addAccessTokenAndHmacToUrl(url, appAccessTokenMetadata)
  }

  // Returns a fully formed url to call the auth endpoint
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

  // Returns a fully formed url to call the sign endpoint
  // chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin', 'ore_main', 'eos_test', etc.
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
      signatureOnly,
      signedTransaction,
      state,
      transaction,
      transactionRecordId,
      userPassword,
    } = signOptions
    let { chainAccount } = signOptions
    const { oreIdUrl } = this.options

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
    optionalParams += !isNullOrEmpty(processId) ? `&process_id=${processId}` : ''
    optionalParams += !isNullOrEmpty(returnSignedTransaction)
      ? `&return_signed_transaction=${returnSignedTransaction}`
      : ''
    optionalParams += !isNullOrEmpty(transactionRecordId) ? `&transaction_record_id=${transactionRecordId}` : ''
    optionalParams += !isNullOrEmpty(userPassword) ? `&user_password=${userPassword}` : ''
    optionalParams += !isNullOrEmpty(signatureOnly) ? `&signature_only=${signatureOnly}` : ''
    optionalParams += !isNullOrEmpty(processId) ? `&process_id=${processId}` : ''
    optionalParams += !isNullOrEmpty(provider) ? `&provider=${provider}` : ''
    optionalParams += !isNullOrEmpty(userPassword) ? `&user_password=${userPassword}` : ''

    // prettier-ignore
    const url = `${oreIdUrl}/sign#account=${account}&broadcast=${broadcast}&callback_url=${encodeURIComponent(callbackUrl)}&chain_account=${chainAccount}&chain_network=${encodeURIComponent(chainNetwork)}${optionalParams}`
    return this.addAccessTokenAndHmacToUrl(url, null)
  }

  // Returns a fully formed url to call the auth endpoint
  async getRecoverAccountUrl(args: GetOreIdRecoverAccountUrlParams) {
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

  // Extracts the response parameters on the /auth callback URL string
  handleAuthResponse(callbackUrlString: string): AuthResponse {
    // Parses error codes and returns an errors array
    // (if there is an error_code param sent back - can have more than one error code - seperated by a ‘&’ delimeter
    // NOTE: accessToken and idToken are not usually returned from the ORE ID service - they are included here for future support
    const params = Helpers.urlParamsToArray(callbackUrlString)
    const { access_token: accessToken, account, id_token: idToken, process_id: processId, state } = params
    const errors = this.getErrorCodesFromParams(params)
    const response: any = { account }
    if (accessToken) response.accessToken = accessToken
    if (idToken) response.idToken = idToken
    if (errors) response.errors = errors
    if (processId) response.processId = processId
    if (state) response.state = state
    this.setIsBusy(false)
    return response
  }

  // Extracts the response parameters on the /new-account callback URL string
  handleNewAccountResponse(callbackUrlString: string): NewAccountResponse {
    const params = Helpers.urlParamsToArray(callbackUrlString)
    const { chain_account: chainAccount, process_id: processId, state } = params
    const errors = this.getErrorCodesFromParams(params)
    this.setIsBusy(false)
    return { chainAccount, processId, state, errors }
  }

  // Extracts the response parameters on the /sign callback URL string
  handleSignResponse(callbackUrlString: string): SignResponse {
    let signedTransaction
    const params = Helpers.urlParamsToArray(callbackUrlString)
    const {
      signed_transaction: encodedTransaction,
      process_id: processId,
      state,
      transaction_id: transactionId,
    } = params
    const errors = this.getErrorCodesFromParams(params)

    if (!errors) {
      // Decode base64 parameters
      signedTransaction = Helpers.base64DecodeSafe(encodedTransaction)
    }
    this.setIsBusy(false)
    return { signedTransaction, processId, state, transactionId, errors }
  }

  // Calls the {oreIDUrl}/api/app-token endpoint to get the appAccessToken
  async getNewAppAccessToken({ appAccessTokenMetadata, processId }: GetNewAppAccessTokenParams) {
    const response = await this.callOreIdApi(RequestType.Post, ApiEndpoint.AppToken, appAccessTokenMetadata, processId)
    const { appAccessToken, processId: processIdReturned } = response
    this.appAccessToken = appAccessToken
  }

  // Get the user info from ORE ID for the given user account
  async getUserInfoFromApi(account: AccountName, processId: ProcessId = null) {
    if (!isNullOrEmpty(account)) {
      const queryParams = { account }
      const response = await this.callOreIdApi(RequestType.Get, ApiEndpoint.GetUser, queryParams, processId)
      const { data, processId: processIdReturned } = this.extractProcessIdFromData(response)
      this.localState.saveUser(data)
      return data
    }
    return null
  }

  // Get the config (setting) values of a specific type
  async getConfigFromApi(configType: Config.Chains, processId: ProcessId = null) {
    if (!configType) {
      throw new Error('Missing a required parameter: configType')
    }
    const queryParams = { type: configType }
    const { values, processId: processIdReturned } =
      (await this.callOreIdApi(RequestType.Get, ApiEndpoint.GetConfig, queryParams, processId)) || {}
    if (Helpers.isNullOrEmpty(values)) {
      throw new Error(`Not able to retrieve config values for ${configType}`)
    }
    return values
  }

  // Adds a public key to an account with a specific permission name
  // The permission name must be one defined in the App Registration record (Which defines its parent permission as well as preventing adding rougue permissions)
  // This feature allows your app to hold private keys locally (for certain actions enabled by the permission) while having the associated public key in the user's account
  // chainAccount = name of the account on the chain - 12/13-digit string on EOS and Ethereum Address on ETH - it may be the same as the account
  // chainNetwork = one of the valid options defined by the system - Ex: 'eos_main', 'eos_jungle', 'eos_kylin", 'ore_main', 'eos_test', etc.
  async addPermission(
    account: AccountName,
    chainAccount: ChainAccount,
    chainNetwork: ChainNetwork,
    publicKey: PublicKey,
    parentPermission: PermissionName,
    permission: PermissionName,
    provider: AuthProvider,
    processId?: ProcessId,
  ): Promise<AddPermissionParams> {
    const optionalParams: { [key: string]: any } = {}

    if (provider) {
      optionalParams['wallet-type'] = provider
    }

    if (parentPermission) {
      optionalParams['parent-permission'] = parentPermission
    }

    const queryParams = {
      account,
      'chain-account': chainAccount,
      'chain-network': chainNetwork,
      'public-key': publicKey,
      permission,
      ...optionalParams,
    }

    // if failed, error will be thrown
    // TODO: make this a post request on the api
    const response = await this.callOreIdApi(RequestType.Get, ApiEndpoint.AddPermission, queryParams, processId)
    return response
  }

  // Helper function to call api endpoint and inject api-key
  // here params can be query params in case of a GET request or body params in case of POST request
  // processId (optional) - can be used to associate multiple calls together into a single process flow
  async callOreIdApi(
    requestMethod: RequestType,
    endpoint: ApiEndpoint,
    params: { [key: string]: any } = {},
    processId: ProcessId = null,
  ) {
    let urlString
    let response
    let data
    const { apiKey, serviceKey, oreIdUrl } = this.options
    // if running in browser, we dont call the api directly, we use a proxy server (unless we're running a demo app)
    // calls to the proxy server must start with '/' (not an host like http://server) and we'll prepend 'oreid' to it e.g. /oreid/api/xxx to make it easier to do proxy server routing
    const oreIdUrlBase = this.requiresProxyServer ? '/oreid' : oreIdUrl
    const url = `${oreIdUrlBase}/api/${endpoint}`

    const headers: { [key: string]: any } = { 'api-key': apiKey }
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
    } catch (error) {
      // Browser thre an error during CORS preflight post - See https://github.com/axios/axios/issues/1143
      if (error?.message.toLowerCase() === 'network error') {
        throw new Error(
          'Browser threw a Network Error. This is likely because of CORS error. Make sure that you are not sending an api-key in the header of the request.',
        )
      }
      ;({ data = {} } = error?.response || {})
      const { message } = data
      const errorCodes = this.getErrorCodesFromParams(data)
      // oreid apis pass back errorCode/errorMessages
      // also handle when a standard error message is thrown
      const errorString = errorCodes || message || 'unknown error'
      throw new Error(errorString)
    }

    ;({ data } = response)
    return data
  }

  //  Params is a javascript object representing the parameters parsed from an URL string
  getErrorCodesFromParams(params: any) {
    let errorCodes: string[]
    const errorString = params.error_code || params.errorCode
    const errorMessage = params.error_message || params.errorMessage
    if (errorString) {
      errorCodes = errorString.split(/[/?/$&]/)
    }
    if (errorCodes || errorMessage) {
      errorCodes = errorCodes || []
      errorCodes.push(errorMessage)
    }
    return errorCodes
  }

  // We don't really maintain a logged-in state
  // However, we do have local cached user data, so clear that
  logout() {
    this.localState.clear()
  }

  isCustodial(provider: AuthProvider) {
    return provider === AuthProvider.Custodial
  }

  isUALProvider(provider: AuthProvider) {
    return supportedUALProviders.includes(provider)
  }

  isTransitProvider(provider: AuthProvider) {
    return supportedTransitProviders.includes(provider)
  }

  /** Whether this Eos Transit provider was installed upon instantiation */
  hasTransitProvider(provider: AuthProvider): boolean {
    return this.transitProvidersInstalled.includes(provider)
  }

  /** Whether this UAL provider was installed upon instantiation */
  hasUALProvider(provider: AuthProvider): boolean {
    return this.ualProvidersInstalled.includes(provider)
  }

  getWalletProviderInfo(provider: AuthProvider, type: ExternalWalletInterface) {
    if (!provider || !type) {
      return {
        ualProviderAttributes: ualProviderAttributesData,
        transitProviderAttributes: transitProviderAttributesData,
      }
    }

    if (type === ExternalWalletInterface.Transit) {
      return getTransitProviderAttributes(provider)
    }

    if (type === ExternalWalletInterface.Ual) {
      return getUALProviderAttributes(provider)
    }
    return null
  }

  generateProcessId() {
    const guid = Helpers.createGuid()
    // get the last 12 digits
    const processId = guid.slice(-12)
    return processId
  }

  /** remove processId from data */
  extractProcessIdFromData(data: any) {
    let processId
    if (data?.processId) {
      processId = data.processId
      delete data.processId
    }
    return { data, processId }
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
      const appAccessToken = overrideAppAccessToken || (await this.getAccessToken({ appAccessTokenMetadata }))
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
