import { ExternalWalletType, ChainPlatformType } from '../common/models'
import {
  TransitDiscoveryData,
  TransitDiscoverKeyLookupCallback,
  TransitDiscoveryAccount,
  TransitDiscoverContinueCallback,
  TransitProviderAttributes,
} from './models'

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

/** Pass-through function used within eos-transit host - if not provided, wallet will try to use EOS to transform keys */
const NonEosDiscoveryKeyLookupFunc: TransitDiscoverKeyLookupCallback = (
  discoveryData: TransitDiscoveryData,
  callback: TransitDiscoverContinueCallback,
) => {
  callback(discoveryData.keyToAccountMap)
}

export const transitProviderAttributesData: TransitProviderAttributes[] = [
  {
    providerName: ExternalWalletType.AlgoSigner,
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
    providerName: ExternalWalletType.Keycat,
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
  {
    providerName: ExternalWalletType.Ledger,
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
    providerName: ExternalWalletType.Lynx,
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
    providerName: ExternalWalletType.Meetone,
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
    providerName: ExternalWalletType.Metro,
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
    providerName: ExternalWalletType.Portis,
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
    providerName: ExternalWalletType.Scatter,
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
    providerName: ExternalWalletType.SimpleEos,
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
    providerName: ExternalWalletType.TokenPocket,
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
    providerName: ExternalWalletType.WalletConnect,
    chainType: ChainPlatformType.ethereum,
    providerId: 'walletconnect',
    requiresLogin: false,
    supportsDiscovery: true,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'This wallet doesn’t require you to login.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    discoveryKeyLookupFunc: NonEosDiscoveryKeyLookupFunc,
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-walletconnect-logo.png',
  },
  {
    providerName: ExternalWalletType.Web3,
    chainType: ChainPlatformType.ethereum,
    providerId: 'web3',
    requiresLogin: false,
    supportsDiscovery: true,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: false,
    requiresDiscoverToLogin: false,
    helpText: {
      login: 'This wallet doesn’t require you to login.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
    discoveryKeyLookupFunc: NonEosDiscoveryKeyLookupFunc,
    logoUrl: 'https://storage.googleapis.com/oreid-files/partners/wallet-web3-logo.png',
  },
  {
    providerName: ExternalWalletType.WhaleVault,
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
]

/** Get provider-specific settings and metadata */
export function getTransitProviderAttributes(walletType: ExternalWalletType): TransitProviderAttributes {
  return transitProviderAttributesData.find(tp => tp.providerName === walletType.toString())
}

/** Get provider-specific settings and metadata */
export function getTransitProviderAttributesByProviderId(providerId: string): TransitProviderAttributes {
  return transitProviderAttributesData.find(tp => tp.providerId === providerId)
}

/** Get the list of provider attributes for a given chain */
export function getTransitProviderAttributesByChain(chain: ChainPlatformType): TransitProviderAttributes[] {
  return transitProviderAttributesData.filter(p => p.chainType === chain)
}

export const supportedTransitProviders: ExternalWalletType[] = transitProviderAttributesData.map(tp => tp.providerName)
