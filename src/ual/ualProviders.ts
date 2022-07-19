import { ExternalWalletType, ChainPlatformType } from '../common/models'

export type UalProviderAttributes = {
  providerName: ExternalWalletType
  chainType: ChainPlatformType
  providerUALName: string
  requiresLogin: boolean
  supportsSignArbitrary: boolean
  supportsDiscovery: boolean
  requiresLogoutLoginToDiscover?: boolean
  requiresDiscoverToLogin?: boolean
  defaultDiscoveryPathIndexList?: number[]
  helpText: {
    login: string
    sign: string
    discover: string
    versionsRequired: string
  }
  logoUrl: string
}

export const ualProviderAttributesData: UalProviderAttributes[] = [
  {
    providerName: ExternalWalletType.Anchor,
    providerUALName: 'Anchor',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: true,
    supportsDiscovery: false, // TODO: Not implemented yet - This is not necessarily correct
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-generic-logo.png', // TODO: Add actual logo
  },
  {
    providerName: ExternalWalletType.Ledger,
    providerUALName: 'Ledger',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: false,
    supportsDiscovery: false, // TODO: Not implemented yet - This is not necessarily correct
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      discover: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      versionsRequired:
        'You need to have recent versions of your browser, Ledger firmware, and the Ledger EOS app. Click here for more details.',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-ledger-logo.png',
  },
  {
    providerName: ExternalWalletType.Lynx,
    providerUALName: 'Lynx',
    chainType: ChainPlatformType.eos,
    requiresLogin: false,
    supportsSignArbitrary: true,
    supportsDiscovery: false, // TODO: Not implemented yet - This is not necessarily correct
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-lynx-logo.png',
  },
  {
    providerName: ExternalWalletType.Scatter,
    providerUALName: 'Scatter',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: true,
    supportsDiscovery: false, // TODO: Not implemented yet - This is not necessarily correct
    helpText: {
      login: 'Scatter requires logging in through the Scatter app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-scatter-logo.png',
  },
  {
    providerName: ExternalWalletType.TokenPocket,
    providerUALName: 'Token Pocket',
    chainType: ChainPlatformType.eos,
    requiresLogin: false,
    supportsSignArbitrary: true,
    supportsDiscovery: false, // TODO: Not implemented yet - This is not necessarily correct
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-generic-logo.png',
  },
  {
    providerName: ExternalWalletType.Wombat,
    providerUALName: 'Wombat',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: true,
    supportsDiscovery: false, // TODO: Not implemented yet - This is not necessarily correct
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-generic-logo.png', // TODO: Add actual logo
  },
]

/** Get provider-specific settings and metadata */
export function getUalProviderAttributes(walletType: ExternalWalletType): UalProviderAttributes {
  return ualProviderAttributesData.find(up => up.providerName === walletType.toString().toLowerCase())
}

/** Get provider-specific settings and metadata by the UAL provider name */
export function getUalProviderAttributesByUalName(walletType: string): UalProviderAttributes {
  return ualProviderAttributesData.find(up => up.providerName === walletType.toLowerCase())
}

export const supportedUALProviders: ExternalWalletType[] = ualProviderAttributesData.map(tp => tp.providerName)
