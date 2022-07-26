import { getUalProviderAttributes, getUalProviderAttributesByUalName, supportedUALProviders } from './ualProviders'
import OreIdContext from '../core/IOreidContext'
import Helpers from '../utils/helpers'
import {
  ChainAccount,
  ChainNetwork,
  ExternalWalletInterface,
  ExternalWalletType,
  LoginWithWalletOptions,
  SignStringParams,
  TransactionData,
} from '../models'
import { User } from '../user/user'
import {
  ConnectToUalProviderParams,
  ConnectToUalProviderResult,
  UalAuthenticator,
  UalAuthenticatorFactory,
  UalUser,
  UserAccountPermissions,
} from './models'
import { Authenticator, SignTransactionResponse } from 'universal-authenticator-library'

export default class UalHelper {
  constructor(args: { oreIdContext: OreIdContext; user: User }) {
    this._oreIdContext = args.oreIdContext
    this._user = args.user
  }

  _oreIdContext: OreIdContext

  _user: User

  /** Verifies that all plugins have a valid name
   *  Stores a list of the installed providerNames for all working plugins in ualProvidersInstalled
   */
  async installUalProviders(ualWalletProviders: UalAuthenticatorFactory[]) {
    // Maps installed UALProviders to array of ExternaLWalletType names
    this._oreIdContext.ualProvidersInstalled = (ualWalletProviders || []).map(
      ualProviderFactory => getUalProviderAttributesByUalName(ualProviderFactory?.name)?.providerName,
    )
  }

  /** Retrieve the user and their account/permission details for the matching chainNetwork
   *  Returns null if nothing in wallet for chainNetwork
   */
  async loginToUalProvider(
    walletType: ExternalWalletType,
    authenticator: Authenticator,
    chainNetwork: ChainNetwork,
    chainAccount: ChainAccount,
  ): Promise<{ user: UalUser; userPermissions: UserAccountPermissions }> {
    this.assertHasProviderInstalled(walletType, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(walletType, chainNetwork)
    try {
      // we get an array of users - one for each chain being used in the wallet
      const users: UalUser[] = await authenticator.login(chainAccount)
      if (Helpers.isNullOrEmpty(users)) return null

      // for every supported chain, populate a result with the user and user's account/permission info
      const usersWithAccountsDetails: { user: UalUser; userPermissions: UserAccountPermissions }[] = []
      await Helpers.asyncForEach(users, async user => {
        const userPermissions = await this.getAccountAndPermissionsFromUalUser(user)
        usersWithAccountsDetails.push({ user, userPermissions })
      })

      // get only the user matching the desired chainNetwork
      const userForChain = usersWithAccountsDetails.find(uwa => uwa.userPermissions.chainNetwork === chainNetwork)
      return userForChain
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
  async connectToUalProvider({
    walletType,
    chainNetwork,
    chainAccount = null,
  }: ConnectToUalProviderParams): Promise<ConnectToUalProviderResult> {
    this.assertHasProviderInstalled(walletType, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(walletType, chainNetwork)
    const { options } = this._oreIdContext

    const SelectedAuthenticator = options.ualAuthenticators.find(
      ualAuthenticator => ualAuthenticator.name.toLowerCase() === walletType,
    )

    try {
      const networkConfig = await this._oreIdContext.settings.getChainNetworkNextworkConfig(chainNetwork)
      const ualNetworkConfig = {
        chainId: networkConfig.chainId,
        rpcEndpoints: [
          {
            ...networkConfig,
          },
        ],
      }
      // construct authenticator
      const authenticator = new SelectedAuthenticator([ualNetworkConfig], {
        appName: options.appName,
      })

      this._oreIdContext.setIsBusy(true) // busy is cleared by waitWhileWalletIsBusy when done
      await authenticator.init()
      await this.waitWhileWalletIsBusy(authenticator, walletType)

      // TODO: consider if we should wait while .isLoading()

      if (authenticator.isErrored()) {
        const ualError = authenticator.getError()
        console.log(`Error connecting to UAL wallet type: ${ualError.name}`, ualError.cause)
        throw ualError.cause // re-throw error
      }

      // // TODO: consider if this code is relevant
      // if (authenticator.shouldAutoLogin() !== true) return null

      const userForChain = await this.loginToUalProvider(walletType, authenticator, chainNetwork, chainAccount)

      // No user in the wallet for the given chainNetwork
      if (!userForChain) {
        console.log(`User doesn't have an account for the chainNetwork: ${chainNetwork} in wallet type: ${walletType}`)
        return null
      }

      // Update permissions in oreId - TODO: consider if we should update all the permissions in all the found chains (in usersWithAccountsDetails)
      try {
        await this.updateOreAccountPermissionsfromUalUser(userForChain.user, walletType)
      } catch (error) {
        console.log(
          `Failed to add newly discovered chain accounts in connectToUalProvider for chainNetwork: ${chainNetwork} in wallet type: ${walletType}`,
          error,
        )
      }

      // const {
      //   account,
      //   chainNetwork: chainNetworkFromAuthenticator, // get the chainNetwork from the UALProvider since we cant tell it what network to use
      //   permissions,
      // } = await this.getAccountAndPermissionsFromUalUser(user)
      // const publicKeys = await user.getKeys()
      // const account = await user.getAccountName()
      // const permissions = [{ name: 'active', publicKey: publicKeys[0] }]

      const response = {
        isLoggedIn: true,
        chainAccount: userForChain.userPermissions.chainAccount,
        chainNetwork: userForChain.userPermissions.chainNetwork,
        permissions: userForChain.userPermissions.permissions,
        walletType,
        authenticator,
        ualUser: userForChain.user,
      }
      return response
    } catch (error) {
      console.log(`Failed to connect to ${walletType} wallet:`, error)
      throw error
    }
  }

  /** Extract user account/permission for all publicKeys in the User's wallet */
  async getAccountAndPermissionsFromUalUser(ualUser: UalUser): Promise<UserAccountPermissions> {
    const chainId = await ualUser.getChainId()
    const chainNetwork = await this._oreIdContext.settings.getChainNetworkByChainId(chainId)
    const account = await ualUser.getAccountName()
    const publicKeys = await ualUser.getKeys()
    // for each publicKey in the user's wallet, return a WalletPermission object
    const permissions = publicKeys.map(publicKey => ({
      account,
      publicKey,
      name: 'active', // UAL doesn't return the permission so we default to active
      // todo: add parent permission when available
    }))
    return { chainAccount: account, chainNetwork, permissions }
  }

  /** Login using the wallet provider */
  async loginWithUalProvider(loginOptions: LoginWithWalletOptions) {
    const { walletType, chainAccount, chainNetwork } = loginOptions
    // Connect to Provider
    const response = await this.connectToUalProvider({ walletType, chainAccount, chainNetwork })
    const { authenticator, isLoggedIn } = response
    // Login if needed - if not logged-in by connectToUalProvider, then call login explicitly
    if (!isLoggedIn) {
      const userForChain = await this.loginToUalProvider(walletType, authenticator, chainNetwork, chainAccount)
      if (userForChain) {
        await this.updateOreAccountPermissionsfromUalUser(userForChain.user, walletType)
      }
    }
    return response
  }

  /** Throw if the required plug-in is not installed */
  assertHasProviderInstalled(provider: ExternalWalletType, providerType: ExternalWalletInterface) {
    if (providerType === ExternalWalletInterface.Ual) {
      if (!this.hasUalProvider(provider)) {
        throw Error(`UAL authenticator:"${provider}" not installed. Please pass it in via ualAuthenticators.`)
      }
    }
  }

  /** sign with a UAL wallet */
  async signWithUalProvider(transactionData: TransactionData, walletType: ExternalWalletType) {
    const { chainNetwork, transaction, chainAccount, signOptions } = transactionData
    const { provider, broadcast } = signOptions
    this.assertHasProviderInstalled(walletType, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(walletType, chainNetwork)
    const { ualUser } = await this.connectToUalProvider({ walletType, chainNetwork, chainAccount })
    let signedTransactionResponse: SignTransactionResponse
    try {
      this._oreIdContext.setIsBusy(true)
      signedTransactionResponse = await ualUser.signTransaction({ actions: [transaction] }, { broadcast })

      // TODO: Test that this code works

      // Convert serializedTransaction from UInt8Array to Buffer
      // i.e. when stringified change from: '{\"0\":129,\"1\":163'} to {"type":"Buffer","data":[129,163]}
      const { serializedTransaction } = signedTransactionResponse.transaction
      if (serializedTransaction) {
        signedTransactionResponse.transaction.serializedTransaction = Buffer.from(serializedTransaction)
      }
      return { signedTransaction: signedTransactionResponse.transaction }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this._oreIdContext.setIsBusy(false)
    }
  }

  /** Signs an arbitrary string using a specific provider */
  async signStringWithUalProvider({ walletType, chainNetwork, string, chainAccount, message }: SignStringParams) {
    this.assertHasProviderInstalled(walletType, ExternalWalletInterface.Ual)
    this.assertProviderValidForChainNetwork(walletType, chainNetwork)
    const { ualUser } = await this.connectToUalProvider({ walletType, chainNetwork, chainAccount })
    try {
      this._oreIdContext.setIsBusy(true)
      const keys = await ualUser.getKeys()
      const response = await ualUser.signArbitrary(keys[0], string, message)
      return { signedString: response }
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      this._oreIdContext.setIsBusy(false)
    }
  }

  /** Add the account selected in the UAL User to the ORE account's list of account/permissions */
  async updateOreAccountPermissionsfromUalUser(user: UalUser, walletType: ExternalWalletType): Promise<void> {
    if (!user) return

    const { chainAccount, chainNetwork, permissions } = await this.getAccountAndPermissionsFromUalUser(user)
    // abort silently if account is missing some info - some chains/wallets (e.g. ethereum) dont provide the public key, so we can't add the perm here
    if (!chainAccount || !permissions || !chainNetwork) return

    // save permissions to oreid service
    await this._user?.updatePermissionsIfNecessary({
      chainAccount,
      chainNetwork,
      permissions,
      walletType,
    })
    return
  }

  /** Whether this UAL provider was installed upon instantiation */
  isUalProvider(walletType: ExternalWalletType) {
    const walletProviderType = Helpers.mapAuthProviderToWalletType(walletType)
    if (!walletProviderType) return false
    return supportedUALProviders.includes(walletProviderType)
  }

  /** Whether this UAL provider was installed upon instantiation */
  hasUalProvider(walletType: ExternalWalletType): boolean {
    return this._oreIdContext.ualProvidersInstalled.includes(walletType)
  }

  /** Throw if the provider doesnt support the specified chainNetwork */
  async assertProviderValidForChainNetwork(walletType: ExternalWalletType, chainNetwork: ChainNetwork) {
    const { chainType } = getUalProviderAttributes(walletType)
    const networks = await this._oreIdContext.settings.getAllChainNetworkSettings()
    const isValid = !!networks.find(n => n.network === chainNetwork && n.type === chainType)
    if (!isValid) {
      throw Error(
        `External Wallet Type: ${walletType} doesnt support chainNetwork ${chainNetwork}. Hint: It supports networks of type ${chainType}.`,
      )
    }
  }

  /** set isBusy on oreIdContext while wallet authenticator isLoading */
  private async waitWhileWalletIsBusy(ualAuthenticator: UalAuthenticator, walletType: ExternalWalletType) {
    console.log('ualAuthenticator.isLoading:', ualAuthenticator.isLoading())
    while (ualAuthenticator.isLoading()) {
      this._oreIdContext.setIsBusy(true)
      // todo: add timeout
      // eslint-disable-next-line no-await-in-loop
      await Helpers.sleep(250)
      console.log(`connecting to ${walletType} via UAL wallet in progress:`, ualAuthenticator.isLoading())
    }
    this._oreIdContext.setIsBusy(false)
  }

  // Supported features by provider

  /** whether discovery is supported by the provider */
  canDiscover(walletType: ExternalWalletType) {
    if (this.hasUalProvider(walletType)) {
      return getUalProviderAttributes(walletType).supportsDiscovery
    }
    return false
  }

  /** whether signString is supported by the provider */
  canSignString(walletType: ExternalWalletType) {
    if (this.hasUalProvider(walletType)) {
      return getUalProviderAttributes(walletType).supportsSignArbitrary
    }
    return false
  }

  /** whether call to discover is required by provider before login */
  requiresDiscoverToLogin(walletType: ExternalWalletType) {
    if (this.hasUalProvider(walletType)) {
      return getUalProviderAttributes(walletType).requiresDiscoverToLogin
    }
    return false
  }

  /** whether call to logout then login is required by provider before discover */
  requiresLogoutLoginToDiscover(walletType: ExternalWalletType) {
    if (this.hasUalProvider(walletType)) {
      return getUalProviderAttributes(walletType).requiresLogoutLoginToDiscover
    }
    return false
  }

  /** default path index for provider (if any) */
  defaultDiscoveryPathIndexList(walletType: ExternalWalletType): number[] {
    if (this.hasUalProvider(walletType)) {
      return getUalProviderAttributes(walletType)?.defaultDiscoveryPathIndexList
    }
    return null
  }

  /** help text displayed to user for provider */
  helpTextForProvider(walletType: ExternalWalletType) {
    if (this.hasUalProvider(walletType)) {
      return getUalProviderAttributes(walletType).helpText
    }

    return null
  }
}
