import { callApiGetConfig } from '../api'
import { ChainNetwork, ConfigType, SettingChainNetwork } from '../models'
import Helpers from '../utils/helpers'
import OreIdContext from './IOreidContext'

export default class Settings {
  constructor(args: { oreIdContext: OreIdContext }) {
    this._oreIdContext = args.oreIdContext
    this._cachedChainNetworks = null
  }

  private _cachedChainNetworks: SettingChainNetwork[] = []

  private _oreIdContext: OreIdContext

  /** Calls getConfigFromApi() to retrieve settings for all chain networks defined by OreID service
   * and caches the result */
  async getAllChainNetworkSettings(): Promise<SettingChainNetwork[]> {
    if (Helpers.isNullOrEmpty(this._cachedChainNetworks)) {
      // load the chainNetworks list from the ORE ID API
      const results = await this.getConfigFromApi(ConfigType.Chains)
      this._cachedChainNetworks = results.chains // as SettingChainNetwork[]
    }

    return this._cachedChainNetworks
  }

  /** Returns Chain Network Settings for a specific chain */
  async getChainNetworkSettings(chainNetwork: ChainNetwork) {
    const networks = await this.getAllChainNetworkSettings()
    return networks.find(n => n.network === chainNetwork)
  }

  /** Loads settings value from the server
    e.g. configType='chains' returns valid chain types and addresses */
  async getConfig(configType: ConfigType) {
    return this.getConfigFromApi(configType)
  }

  /**
   *  Call api services/config to get configuration values of a specific type
   *  Returns: for configType:Config.Chains, returns array of SettingChainNetwork objects for all chains suported by the service
   * */
  async getConfigFromApi(configType: ConfigType.Chains) {
    const values = await callApiGetConfig(this._oreIdContext, { configType })
    if (Helpers.isNullOrEmpty(values)) {
      throw new Error(`Not able to retrieve config values for ${configType}`)
    }
    return values
  }
}
