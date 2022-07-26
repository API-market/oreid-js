import { getUalProviderAttributes, supportedUALProviders, ualProviderAttributesData } from '../ual/ualProviders'
import { getTransitProviderAttributes, transitProviderAttributesData } from '../transit'
import { externalWalletsNotImplemented } from '../constants'
import OreIdContext from '../core/IOreidContext'
import Helpers from '../utils/helpers'
import {
  AuthProvider,
  ChainNetwork,
  ChainPlatformType,
  ExternalWalletType,
  LoginWithWalletOptions,
  SignStringParams,
  TransactionData,
} from '../models'
import TransitHelper from '../transit/TransitHelper'
import UalHelper from '../ual/UalHelper'
import { ExternalWalletInterface, WalletProviderAttributes } from './models'

export default class WalletHelper {
  constructor(args: { oreIdContext: OreIdContext; transitHelper: TransitHelper; ualHelper: UalHelper }) {
    this._oreIdContext = args.oreIdContext
    this._transitHelper = args.transitHelper
    this._ualHelper = args.ualHelper
  }

  _oreIdContext: OreIdContext

  _transitHelper: TransitHelper

  _ualHelper: UalHelper

  /** Transit wallet plugin helper functions and connections */
  get transitHelper() {
    return this._transitHelper
  }

  /** Ual wallet plugin helper functions and connections */
  get ualHelper() {
    return this._ualHelper
  }

  //** Whether wallet type is a Transit or Ual wallet */
  isAValidExternalWalletType(walletType: ExternalWalletType) {
    return (
      (this._transitHelper.isTransitProvider(walletType) || this._ualHelper.isUalProvider(walletType)) &&
      !externalWalletsNotImplemented.includes(walletType)
    )
  }

  /** Returns metadata about the installed external wallet type (e.g. name, logo) and which features it supports
   *  If optional externalWalletInterface param provided, then gets Info for the specified type (Transit or UAL) instead of seeing what's installed
   */
  getExternalWalletInfo(
    walletType: ExternalWalletType,
    externalWalletInterface?: ExternalWalletInterface,
  ): WalletProviderAttributes {
    if (!this.isAValidExternalWalletType(walletType)) {
      throw new Error(`Not a valid external wallet type: ${walletType}`)
    }
    if (
      this._transitHelper.hasTransitProvider(walletType) ||
      externalWalletInterface === ExternalWalletInterface.Transit
    ) {
      return getTransitProviderAttributes(walletType)
    }
    if (this._ualHelper.hasUalProvider(walletType) || externalWalletInterface === ExternalWalletInterface.Ual) {
      return getUalProviderAttributes(walletType)
    }
    return null
  }

  /** Returns wallet metadata (for installed wallet providers) for a given chain */
  getExternalWalletInfoByChain(chain: ChainPlatformType): WalletProviderAttributes[] {
    const transitWalletsInstalledInfo = transitProviderAttributesData.filter(info =>
      this._oreIdContext.transitProvidersInstalled.includes(info.providerName),
    )
    const ualWalletsInstalledInfo = ualProviderAttributesData.filter(info =>
      this._oreIdContext.transitProvidersInstalled.includes(info.providerName),
    )

    return [...transitWalletsInstalledInfo, ...ualWalletsInstalledInfo].filter(p => p.chainType === chain)
  }

  /** Connect to the wallet provider
   *  For some wallet types, this will include an unlock and 'login' flow to select a chain account
   *  If a chainAccount is selected, it and it's associated publicKey (if available) will be saved to the user's OreId wallet as an 'external key' */
  async connectToWalletProvider(loginOptions: LoginWithWalletOptions) {
    const { walletType } = loginOptions
    if (!this.isAValidExternalWalletType(walletType)) {
      throw new Error(`Not a valid external wallet type: ${walletType}`)
    }
    if (this._transitHelper.hasTransitProvider(walletType)) {
      return this._transitHelper.loginWithTransitProvider(loginOptions)
    } else if (this._ualHelper.hasUalProvider(walletType)) {
      return this._ualHelper.loginWithUalProvider(loginOptions)
    }
    throw new Error(`Wallet type ${walletType} invalid or not installed`)
  }

  /** Sign with a supported blockchain wallet via Transit provider */
  async signWithWallet(walletType: ExternalWalletType, transactionData: TransactionData) {
    let signResult = {}
    if (!this._oreIdContext.walletHelper.isAValidExternalWalletType(walletType)) {
      throw new Error(`signWithWallet not supported for external wallet type: ${walletType}`)
    }
    const provider = Helpers.toEnumValue(AuthProvider, walletType)

    if (this._transitHelper.hasTransitProvider(walletType)) {
      // Treat as Transit interface
      signResult = this._transitHelper.signWithTransitProvider(transactionData, walletType)
      // If we've signed a transaction with a key in a wallet, callDiscoverAfterSign() will add it to the user's wallet
      const { account, chainNetwork } = transactionData
      await this._transitHelper.callDiscoverAfterSign({ account, chainNetwork, signOptions: { provider } })
    } else if (this._ualHelper.hasUalProvider(walletType)) {
      // Treat as UAL interface
      signResult = await this._ualHelper.signWithUalProvider(transactionData, walletType)
      // await this.ualHelper.callDiscoverAfterSign({ account, chainNetwork, signOptions: { provider } })
    }

    return signResult
  }

  /** Sign an arbitrary string (instead of a transaction)
   * This only supports Transit and Ual wallets
   */
  async signStringWithWallet(params: SignStringParams) {
    const { account, walletType, chainNetwork } = params
    let signResult = {}
    if (!this.isAValidExternalWalletType(walletType)) {
      throw new Error(`signStringWithWallet not supported for external wallet type: ${walletType}`)
    }
    const provider = Helpers.toEnumValue(AuthProvider, walletType)

    if (this._transitHelper.hasTransitProvider(walletType)) {
      // Treat as Transit interface
      if (!this._transitHelper.canSignString(walletType)) {
        throw Error(`The specific walletType ${walletType} does not support signString`)
      }
      signResult = await this._transitHelper.signStringWithTransitProvider(params)
      await this._transitHelper.callDiscoverAfterSign({ account, chainNetwork, signOptions: { provider } })
    } else if (this._ualHelper.hasUalProvider(walletType)) {
      // Treat as UAL interface
      if (!this._ualHelper.canSignString(walletType)) {
        throw Error(`The specific walletType ${walletType} does not support signString`)
      }
      signResult = await this._ualHelper.signStringWithUalProvider(params)
      // await this.ualHelper.callDiscoverAfterSign({ account, chainNetwork, signOptions: { provider } })
    }
    return signResult
  }

  /** Throw if the provider doesnt support the specified chainNetwork */
  async assertWalletTypeValidForChainNetwork(
    walletType: ExternalWalletType,
    chainNetwork: ChainNetwork,
    externalWalletInterface?: ExternalWalletInterface,
  ) {
    const { chainType } = this.getExternalWalletInfo(walletType, externalWalletInterface)
    const networks = await this._oreIdContext.settings.getAllChainNetworkSettings()
    const isValid = !!networks.find(n => n.network === chainNetwork && n.type === chainType)
    if (!isValid) {
      throw Error(
        `External Wallet Type: ${walletType} doesnt support chainNetwork ${chainNetwork}. Hint: It supports networks of type ${chainType}.`,
      )
    }
  }

  // Supported features by wallet provider

  /** whether discovery is supported by the provider */
  canDiscover(walletType: ExternalWalletType, externalWalletInterface?: ExternalWalletInterface) {
    return this.getExternalWalletInfo(walletType, externalWalletInterface)?.supportsDiscovery || false
  }

  /** whether signString is supported by the provider */
  canSignString(walletType: ExternalWalletType, externalWalletInterface?: ExternalWalletInterface) {
    return this.getExternalWalletInfo(walletType, externalWalletInterface)?.supportsSignArbitrary || false
  }

  /** whether call to discover is required by provider before login */
  requiresDiscoverToLogin(walletType: ExternalWalletType, externalWalletInterface?: ExternalWalletInterface) {
    return this.getExternalWalletInfo(walletType, externalWalletInterface)?.requiresDiscoverToLogin || false
  }

  /** whether call to logout then login is required by provider before discover */
  requiresLogoutLoginToDiscover(walletType: ExternalWalletType, externalWalletInterface?: ExternalWalletInterface) {
    return this.getExternalWalletInfo(walletType, externalWalletInterface)?.requiresLogoutLoginToDiscover || false
  }

  /** default path index for provider (if any) */
  defaultDiscoveryPathIndexList(
    walletType: ExternalWalletType,
    externalWalletInterface?: ExternalWalletInterface,
  ): number[] {
    return this.getExternalWalletInfo(walletType, externalWalletInterface)?.defaultDiscoveryPathIndexList || null
  }

  /** help text displayed to user for provider */
  helpTextForProvider(walletType: ExternalWalletType, externalWalletInterface?: ExternalWalletInterface) {
    return this.getExternalWalletInfo(walletType, externalWalletInterface)?.helpText || null
  }
}
