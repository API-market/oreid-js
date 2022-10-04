import { ExternalWalletType, ChainPlatformType } from '../common/models'
import { UalProviderAttributes } from '../ual/models'

export const ualProviderAttributesData: UalProviderAttributes[] = [
  {
    providerName: ExternalWalletType.Anchor,
    providerId: 'Anchor',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    supportsDiscovery: false,
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
    providerId: 'Ledger',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    supportsDiscovery: false,
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
    providerId: 'Lynx',
    chainType: ChainPlatformType.eos,
    requiresLogin: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    supportsDiscovery: false,
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
    providerId: 'Scatter',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    supportsDiscovery: false,
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
    providerId: 'Token Pocket',
    chainType: ChainPlatformType.eos,
    requiresLogin: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    supportsDiscovery: false,
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
    providerId: 'Wombat',
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    supportsDiscovery: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-wombat-logo.png', // TODO: Add actual logo
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
