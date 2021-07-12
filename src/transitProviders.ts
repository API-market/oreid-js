import {
  AuthProvider,
  ChainPlatformType,
  TransitDiscoveryData,
  TransitDiscoverKeyLookupCallback,
  TransitDiscoveryAccount,
  TransitDiscoverContinueCallback,
} from './types'

export type TransitProviderAttributes = {
  providerName: AuthProvider
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
  discoveryKeyLookupFunc?: TransitDiscoverKeyLookupCallback
  logoUrl: string
}

/** Function used within transit provider to transform a wallet's public key to a full account strucutre */
const AlgorandDiscoveryKeyLookupFunc: TransitDiscoverKeyLookupCallback = (
  discoveryData: TransitDiscoveryData,
  callback: TransitDiscoverContinueCallback,
) => {
  const accountInfoArray: TransitDiscoveryAccount[] = discoveryData.keys.map(key => {
    // note holds a stringified JSON object - composed by Algosigner Transit plugin
    const account = JSON.parse(key.note)
    return {
      index: key.index,
      key: key.key,
      accounts: [
        {
          account: account?.accountName,
          authorization: account?.permission,
        },
      ],
    }
  })
  callback(accountInfoArray)
}

export const transitProviderAttributesData: TransitProviderAttributes[] = [
  {
    providerName: AuthProvider.AlgoSigner,
    chainType: ChainPlatformType.algorand,
    providerId: 'algosigner',
    requiresLogin: false,
    supportsDiscovery: true,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'This wallet doesn’t require you to login.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    discoveryKeyLookupFunc: AlgorandDiscoveryKeyLookupFunc,
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-algosigner-logo.png',
  },
  {
    providerName: AuthProvider.Web3,
    chainType: ChainPlatformType.ethereum,
    providerId: 'web3',
    requiresLogin: false,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'This wallet doesn’t require you to login.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-web3-logo.png',
  },
  {
    providerName: AuthProvider.Ledger,
    chainType: ChainPlatformType.eos,
    providerId: 'ledger',
    requiresLogin: true,
    supportsDiscovery: true,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: true,
    defaultDiscoveryPathIndexList: [0, 1, 2],
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
    providerName: AuthProvider.Lynx,
    chainType: ChainPlatformType.eos,
    providerId: 'EOS Lynx',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'EOS Lynx requires logging in through the EOS Lynx app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-lynx-logo.png',
  },
  {
    providerName: AuthProvider.Meetone,
    chainType: ChainPlatformType.eos,
    providerId: 'meetone_provider',
    requiresLogin: false,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-meetone-logo.png',
  },
  {
    providerName: AuthProvider.Metro,
    chainType: ChainPlatformType.eos,
    providerId: 'metro',
    requiresLogin: false,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-generic-logo.png',
  },
  {
    providerName: AuthProvider.Scatter,
    chainType: ChainPlatformType.eos,
    providerId: 'scatter',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'Scatter requires logging in through the Scatter app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-scatter-logo.png',
  },
  {
    providerName: AuthProvider.TokenPocket,
    chainType: ChainPlatformType.eos,
    providerId: 'TokenPocket',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-generic-logo.png',
  },
  {
    providerName: AuthProvider.Portis,
    chainType: ChainPlatformType.eos,
    providerId: 'PortisProvider',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'Portis requires logging in through the Portis app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-portis-logo.png',
  },
  {
    providerName: AuthProvider.WhaleVault,
    chainType: ChainPlatformType.eos,
    providerId: 'whalevault',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'Whalevault requires logging in through the Whalevault app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-whalevault-logo.png',
  },
  {
    providerName: AuthProvider.SimpleEos,
    chainType: ChainPlatformType.eos,
    providerId: 'simpleos',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'Simpleos requires logging in through the Simpleos app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-simpleos-logo.png',
  },
  {
    providerName: AuthProvider.Keycat,
    chainType: ChainPlatformType.eos,
    providerId: 'Keycat',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'Keycat requires logging in through the Keycat app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-keycat-logo.png',
  },
]

/** Get provider-specific settings and metadata */
export function getTransitProviderAttributes(provider: AuthProvider): TransitProviderAttributes {
  return transitProviderAttributesData.find(tp => tp.providerName === provider.toString())
}

/** Get provider-specific settings and metadata */
export function getTransitProviderAttributesByProviderId(providerId: string): TransitProviderAttributes {
  return transitProviderAttributesData.find(tp => tp.providerId === providerId)
}

/** Get the list of provider attributes for a given chain */
export function getTransitProviderAttributesByChain(chain: ChainPlatformType): TransitProviderAttributes[] {
  return transitProviderAttributesData.filter(p => p.chainType === chain)
}

export const supportedTransitProviders: AuthProvider[] = transitProviderAttributesData.map(tp => tp.providerName)
