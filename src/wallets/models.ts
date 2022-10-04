import { ExternalWalletType, ChainPlatformType } from '../common/models'

export enum ExternalWalletInterface {
  Transit = 'transit',
  Ual = 'ual',
}

export type WalletProviderAttributes = {
  providerName: ExternalWalletType
  chainType: ChainPlatformType
  providerId: string
  requiresLogin: boolean
  supportsDiscovery: boolean
  supportsSignArbitrary: boolean
  requiresLogoutLoginToDiscover: boolean
  requiresDiscoverToLogin: boolean
  defaultDiscoveryPathIndexList?: number[]
  helpText: {
    login: string
    sign: string
    discover: string
    versionsRequired: string
  }
  logoUrl: string
}
