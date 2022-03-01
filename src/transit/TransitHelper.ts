import { initAccessContext, Wallet } from '@aikon/eos-transit'
import { msgPackEncode } from '../utils/chainUtils'
import {
  getTransitProviderAttributes,
  getTransitProviderAttributesByProviderId,
  supportedTransitProviders,
} from './transitProviders'
import OreIdContext from '../core/IOreidContext'
import Helpers from '../utils/helpers'
import {
  AccountName,
  AuthProvider,
  ChainAccount,
  ChainNetwork,
  ChainPlatformType,
  ConnectToTransitProviderParams,
  DiscoverOptions,
  ExternalWalletInterface,
  ExternalWalletType,
  LoginWithWalletOptions,
  PermissionName,
  PublicKey,
  SetupTransitWalletParams,
  SignatureProviderArgs,
  SignatureProviderSignResult,
  SignStringParams,
  TransitAccountInfo,
  TransactionData,
  TransitWallet,
  WalletPermission,
} from '../models'
import { TransitDiscoveryOptions, TransitWalletAccessContext } from '.'
import User from '../user/user'

type ConnectToTransitProviderResult = {
  isLoggedIn?: boolean
  chainAccount?: ChainAccount
  permissions?: [{ name: PermissionName; publicKey: PublicKey }]
  transitWallet?: TransitWallet
  provider?: ExternalWalletType
}

export default class TransitHelper {
  constructor(oreIdContext: OreIdContext, user?: User) {
    this._oreIdContext = oreIdContext
    this._user = user
    this.transitAccessContexts = {}
  }

  _oreIdContext: OreIdContext

  _user: User

  transitAccessContexts: { [key: string]: TransitWalletAccessContext }

  /** Verifies that all plugins provided work (can be constructed)
   *  Stores a list of the installed providerNames (mapped to AuthProvider) for all working plugins in transitProvidersInstalled
   */
  async installTransitProviders() {
    const { eosTransitWalletProviders } = this._oreIdContext.options
    // Executes each provider's contructor to verify it's working
    // stores all the providerName's for all plugins into transitProvidersInstalled array
    this._oreIdContext.transitProvidersInstalled = (eosTransitWalletProviders || [])
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
  }

  /** Inialize EOS Transit wallet provider and return TransitWallet instance */
  async setupTransitWallet({ provider, chainNetwork }: SetupTransitWalletParams): Promise<TransitWallet> {
    this.assertHasProviderInstalled(provider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(provider, chainNetwork)
    const { providerId } = getTransitProviderAttributes(provider)
    const chainContext = await this.getOrCreateTransitAccessContext(chainNetwork)
    const transitProvider = chainContext.getWalletProviders().find(wp => wp.id === providerId)
    const transitWallet = chainContext.initWallet(transitProvider)
    await transitWallet.connect()
    await this.waitWhileWalletIsBusy(transitWallet, provider)
    return transitWallet
  }

  /** Creates an EOS Transit WalletContent for the specified network and plugins
   *  Caches the context for future calls to this function */
  async getOrCreateTransitAccessContext(chainNetwork: ChainNetwork) {
    const { appName, eosTransitWalletProviders = [] } = this._oreIdContext.options
    if (this.transitAccessContexts[chainNetwork]) {
      return this.transitAccessContexts[chainNetwork]
    }

    const networkConfig = await this._oreIdContext.getNetworkConfig(chainNetwork)
    const isNotEosNetwork = await this._oreIdContext.isNotEosNetwork(chainNetwork)
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

  // For Scatter: chainAccount is needed since login will try to use the default account (in scatter
  // and it wil fail to sign the transaction
  /** Handles the call to connect() function on the Transit provider */
  async connectToTransitProvider({
    provider,
    chainNetwork = ChainNetwork.EosMain,
    chainAccount = null,
  }: ConnectToTransitProviderParams): Promise<ConnectToTransitProviderResult> {
    let response: ConnectToTransitProviderResult
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
          await this.updateOreAccountPermissionsfromTransitWalletAuth(transitWallet, provider)
          const { accountName, permission, publicKey } = transitWallet.auth
          response = {
            isLoggedIn: true,
            chainAccount: accountName,
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
      const errMsg = `Failed to connect to ${provider} on ${chainNetwork}. ${error?.message || ''}`
      console.log(`connectToTransitProvider:${errMsg}`, error)
      throw new Error(errMsg)
    } finally {
      this._oreIdContext.setIsBusy(false)
    }

    return response
  }

  /** Handles the call to login() function on the Transit provider
   *  If required by provider, calls discover() and/or logout() before calling login()
   *  IMPORTANT: use loginToTransitProvider() instead of this function */
  async doTransitProviderLogin(
    transitWallet: TransitWallet,
    chainAccount: ChainAccount,
    chainNetwork: ChainNetwork,
    provider: ExternalWalletType,
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
      return null
    }

    const { accountName: transitAccountName } = transitWallet?.auth || {}

    if (chainAccount && transitAccountName !== chainAccount) {
      // keep trying until the user logs in with the correct wallet
      // in scatter, it will ask you to choose an account if you logout and log back in
      // we could also call discover and login to the matching account and that would avoid a step
      await transitWallet.logout()
      this.doTransitProviderLogin(transitWallet, chainAccount, chainNetwork, provider, retryCount + 1)
    }
    return info
  }

  /** Login using the wallet provider */
  async loginWithTransitProvider(loginOptions: LoginWithWalletOptions) {
    const { provider, chainAccount, chainNetwork } = loginOptions
    // Connect to Provider
    const response = await this.connectToTransitProvider({ provider, chainAccount, chainNetwork })
    const wallet = response?.transitWallet
    // Login if needed - if not logged-in by connectToTransitProvider, then call login explicitly
    if (!wallet?.auth) {
      await this.loginToTransitProvider(wallet, provider, chainNetwork, chainAccount)
      await this.updateOreAccountPermissionsfromTransitWalletAuth(wallet, provider)
    }
    return response
  }

  /** Handles the call to login() function on the Transit provider */
  async loginToTransitProvider(
    transitWallet: TransitWallet,
    provider: ExternalWalletType,
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

  /** Throw if the required plug-in is not installed */
  assertHasProviderInstalled(provider: ExternalWalletType, providerType: ExternalWalletInterface) {
    if (providerType === ExternalWalletInterface.Transit) {
      if (!this.hasTransitProvider(provider)) {
        throw Error(`Transit provider ${provider} not installed. Please pass it in via eosTransitWalletProviders.`)
      }
    }
  }

  /** Discovers keys in a wallet provider.
   *  Any new keys discovered in wallet are added to user's ORE ID record.
   *  If the provider doesnt support a discover() function, and requiresLogoutLoginToDiscover == true, attempts a logout then login instead.
   */
  async discoverWithTransit(discoverOptions: DiscoverOptions) {
    const { provider, chainNetwork = ChainNetwork.EosMain, oreAccount, discoveryPathIndexList } = discoverOptions
    Helpers.assertValidProvider(provider)
    const walletProviderType = Helpers.mapAuthProviderToWalletType(provider)
    this.assertProviderValidForChainNetwork(walletProviderType, chainNetwork)
    let result = null
    if (this._oreIdContext.canDiscover(provider)) {
      result = this.discoverCredentialsInTransitWallet(
        chainNetwork,
        walletProviderType,
        oreAccount,
        discoveryPathIndexList,
      )
      console.log('discoverCredentialsInTransitWallet result:', result)
    } else {
      // if provider doesn't support a discover function, we can use login to retrieve a single account/key instead
      const transitWallet = await this.setupTransitWallet({ provider: walletProviderType, chainNetwork })
      if (this._oreIdContext.requiresLogoutLoginToDiscover(provider)) {
        await transitWallet.logout()
        await transitWallet.login()
        this.updateOreAccountPermissionsfromTransitWalletAuth(transitWallet, walletProviderType)
      } else {
        console.log('Discover not working for provider: ', provider)
      }
    }

    return result
  }

  /** Discover all accounts (and related permissions) in the wallet and add them to ORE ID
   * Note: Most wallets don't support discovery */
  async discoverCredentialsInTransitWallet(
    chainNetwork: ChainNetwork,
    provider: ExternalWalletType,
    oreAccount: AccountName,
    discoveryPathIndexList: number[],
  ) {
    let accountsAndPermissions: WalletPermission[] = []

    try {
      const transitWallet = await this.setupTransitWallet({ provider, chainNetwork })
      this._oreIdContext.setIsBusy(true)
      const discoveryData = await transitWallet.discover(
        this.discoverOptionsForProvider(provider, discoveryPathIndexList),
      )
      // this data looks like this: keyToAccountMap[accounts[{account,permission}]] - e.g. keyToAccountMap[accounts[{'myaccount':'owner','myaccount':'active'}]]
      const credentials = discoveryData.keyToAccountMap
      // for each entry in the array, add permission to ore account if not already present
      await Helpers.asyncForEach(credentials, async credential => {
        const { accounts = [], key: publicKey } = credential
        // ethereum may not have a public key - dont save if missing
        if (accounts.length > 0 && !!publicKey) {
          const { account, authorization } = accounts[0]
          const permissions: WalletPermission[] = [
            {
              account,
              publicKey,
              name: authorization,
              parent: null,
            },
          ]
          // Get the chainNetwork from the transitWallet - in case the wallet provider switches networks somehow
          const transitChainNetwork = await this.getChainNetworkFromTransitWallet(transitWallet)
          await this._user?.addWalletPermissionsToOreIdAccount({
            chainAccount: account,
            chainNetwork: transitChainNetwork,
            permissions,
            provider,
          })
          accountsAndPermissions = accountsAndPermissions.concat(permissions)
        }
      })
    } finally {
      this._oreIdContext.setIsBusy(false)
    }
    // return a list of account names and related permissions found
    return accountsAndPermissions
  }

  /** Discover options composed for specific provider */
  discoverOptionsForProvider(
    provider: ExternalWalletType,
    pathIndexListParam: number[] = null,
  ): TransitDiscoveryOptions {
    let pathIndexList
    let keyLookupFunc
    const walletProviderType = Helpers.mapAuthProviderToWalletType(provider)
    if (this.hasTransitProvider(walletProviderType)) {
      const walletProvider = Helpers.mapAuthProviderToWalletType(provider)
      const { defaultDiscoveryPathIndexList, discoveryKeyLookupFunc } = getTransitProviderAttributes(walletProvider)
      pathIndexList = pathIndexListParam || defaultDiscoveryPathIndexList || []
      keyLookupFunc = discoveryKeyLookupFunc // optional
    }

    const response: TransitDiscoveryOptions = { pathIndexList }
    if (keyLookupFunc) {
      response.keyLookupFunc = keyLookupFunc
    }

    return response
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

  /** sign with a Transit wallet */
  async signWithTransitProvider(transactionData: TransactionData) {
    let signedTransaction: SignatureProviderSignResult
    const { chainNetwork, chainAccount } = transactionData
    const { provider } = transactionData?.signOptions || {}
    const walletProvider = Helpers.mapAuthProviderToWalletType(provider)
    this.assertHasProviderInstalled(walletProvider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(walletProvider, chainNetwork)
    // connect to wallet
    const { transitWallet } = await this.connectToTransitProvider({
      provider: walletProvider,
      chainNetwork,
      chainAccount,
    })

    try {
      // sign with transit wallet
      this._oreIdContext.setIsBusy(true)
      const { chainType } = getTransitProviderAttributes(walletProvider)
      // EOS - use eosJS to sign (eosApi.transact)
      if (chainType === ChainPlatformType.eos) {
        signedTransaction = await this.signTransactionWithTransitAndEosSDK(transactionData, transitWallet)
      } else if (chainType === ChainPlatformType.algorand) {
        // Other chains - use sign function on walletProvider
        signedTransaction = await this.signTransactionWithTransitAndAlgorandSDK(transactionData, transitWallet)
      } else if (chainType === ChainPlatformType.ethereum) {
        // Ethereum - use sign function on ethereum walletProvider
        signedTransaction = await this.signTransactionWithTransitAndEthereumSDK(transactionData, transitWallet)
      } else {
        throw new Error(`signWithTransitProvider doesnt support chain type: ${chainType}`)
      }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this._oreIdContext.setIsBusy(false)
    }
    // Convert serializedTransaction from UInt8Array to Buffer
    // i.e. when stringified change from: '{\"0\":129,\"1\":163'} to {"type":"Buffer","data":[129,163]}
    if (signedTransaction.serializedTransaction) {
      signedTransaction.serializedTransaction = Buffer.from(signedTransaction.serializedTransaction)
    }
    return { signedTransaction }
  }

  async signStringWithTransitProvider({ provider, chainNetwork, string, message }: SignStringParams) {
    const walletProvider = Helpers.mapAuthProviderToWalletType(provider)
    this.assertHasProviderInstalled(walletProvider, ExternalWalletInterface.Transit)
    this.assertProviderValidForChainNetwork(walletProvider, chainNetwork)
    const { transitWallet } = await this.connectToTransitProvider({ provider: walletProvider, chainNetwork })
    try {
      this._oreIdContext.setIsBusy(true)
      const response = await transitWallet.signArbitrary(string, message)
      return { signedString: response }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this._oreIdContext.setIsBusy(false)
    }
  }

  /** sign transaction using EOS SDK .transact function */
  private async signTransactionWithTransitAndEosSDK(transactionData: TransactionData, transitWallet: Wallet) {
    const { expireSeconds, transaction } = transactionData
    const { broadcast } = transactionData?.signOptions || {}
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
    await this._oreIdContext.callDiscoverAfterSign(transactionData)
    return { signatures, serializedTransaction }
  }

  /** sign transaction using Algorand SDK */
  private async signTransactionWithTransitAndAlgorandSDK(transactionData: TransactionData, transitWallet: Wallet) {
    const { chainNetwork, transaction } = transactionData
    // Other chains - use sign function on walletProvider
    const networkConfig = await this._oreIdContext.getNetworkConfig(chainNetwork)
    const signParams: SignatureProviderArgs = {
      chainId: networkConfig.chainId, // Chain transaction is for
      requiredKeys: null, // not used by Algorand signatureProvider
      serializedTransaction: msgPackEncode(transaction), // Transaction to sign
      abis: null, // not used by Algorand signatureProvider
    }
    const { signatures, serializedTransaction } = await transitWallet.provider.signatureProvider.sign(signParams)
    await this._oreIdContext.callDiscoverAfterSign(transactionData)
    return { signatures, serializedTransaction }
  }

  /** sign transaction using ethereum web3 SDK */
  private async signTransactionWithTransitAndEthereumSDK(transactionData: TransactionData, transitWallet: Wallet) {
    const { chainNetwork, transaction } = transactionData
    // Other chains - use sign function on walletProvider
    const networkConfig = await this._oreIdContext.getNetworkConfig(chainNetwork)

    const signParams: SignatureProviderArgs = {
      chainId: networkConfig.chainId, // Chain transaction is for
      requiredKeys: null, // not used by Ethereum signatureProvider
      serializedTransaction: msgPackEncode(transaction), // Transaction to sign
      abis: null, // not used by Ethereum signatureProvider
    }
    const { signatures, serializedTransaction } = await transitWallet.provider.signatureProvider.sign(signParams)
    await this._oreIdContext.callDiscoverAfterSign(transactionData)
    return { signatures, serializedTransaction }
  }

  /** Determine the chainNetwork from the transitWallet context */
  async getChainNetworkFromTransitWallet(transitWallet: TransitWallet) {
    const { chainId } = transitWallet?.ctx?.network
    if (!chainId) {
      return null
    }
    const networks = await this._oreIdContext.getChainNetworks()
    return networks.find(net => net.hosts.find(host => host.chainId === chainId))?.network
  }

  /** Add the account selected in the transitWallet to the ORE account's list of account/permissions */
  async updateOreAccountPermissionsfromTransitWalletAuth(transitWallet: TransitWallet, provider: ExternalWalletType) {
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
      await this._user?.updatePermissionsIfNecessary({
        chainAccount: accountName,
        chainNetwork: transitChainNetwork,
        permissions,
        provider,
      })
    }
  }

  isTransitProvider(provider: AuthProvider | ExternalWalletType) {
    const walletProviderType = Helpers.mapAuthProviderToWalletType(provider)
    return supportedTransitProviders.includes(walletProviderType)
  }

  /** Whether this Eos Transit provider was installed upon instantiation */
  hasTransitProvider(provider: ExternalWalletType): boolean {
    return this._oreIdContext.transitProvidersInstalled.includes(provider)
  }

  /** Throw if the provider doesnt support the specified chainNetwork */
  async assertProviderValidForChainNetwork(provider: ExternalWalletType, chainNetwork: ChainNetwork) {
    const { chainType } = getTransitProviderAttributes(provider)
    const networks = await this._oreIdContext.getChainNetworks()
    const isValid = !!networks.find(n => n.network === chainNetwork && n.type === chainType)
    if (!isValid) {
      throw Error(
        `Provider ${provider} doesnt support chainNetwork ${chainNetwork}. Hint: It supports networks of type ${chainType}.`,
      )
    }
  }

  async waitWhileWalletIsBusy(transitWallet: TransitWallet, provider: ExternalWalletType) {
    while (transitWallet.inProgress) {
      this._oreIdContext.setIsBusy(true)
      // todo: add timeout
      // eslint-disable-next-line no-await-in-loop
      await Helpers.sleep(250)
      console.log(`connecting to ${provider} via eos-transit wallet in progress:`, transitWallet.inProgress)
    }
    this._oreIdContext.setIsBusy(false)
  }

  // static something() {
  //   throw Error('Not implemented')
  // }
}
