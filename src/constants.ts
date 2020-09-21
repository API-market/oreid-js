import { ChainPlatformType, TransitProviderAttributes, UalProviderAttributes } from './types'

export const transitProviderAttributesData: {
  [key: string]: TransitProviderAttributes
} = {
  algosigner: {
    chainType: ChainPlatformType.algorand,
    providerId: 'algosigner',
    requiresLogin: false,
    supportsDiscovery: true,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    helpText: {
      login: 'This wallet doesn’t require you to login.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  ledger: {
    chainType: ChainPlatformType.eos,
    providerId: 'ledger',
    requiresLogin: true,
    supportsDiscovery: true,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    defaultDiscoveryPathIndexList: [0, 1, 2],
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      discover: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      versionsRequired:
        'You need to have recent versions of your browser, Ledger firmware, and the Ledger EOS app. Click here for more details.',
    },
  },
  lynx: {
    chainType: ChainPlatformType.eos,
    providerId: 'EOS Lynx',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'EOS Lynx requires logging in through the EOS Lynx app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  meetone: {
    chainType: ChainPlatformType.eos,
    providerId: 'meetone_provider',
    requiresLogin: false,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  metro: {
    chainType: ChainPlatformType.eos,
    providerId: 'metro',
    requiresLogin: false,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  scatter: {
    chainType: ChainPlatformType.eos,
    providerId: 'scatter',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Scatter requires logging in through the Scatter app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  tokenpocket: {
    chainType: ChainPlatformType.eos,
    providerId: 'TokenPocket',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  portis: {
    chainType: ChainPlatformType.eos,
    providerId: 'PortisProvider',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Portis requires logging in through the Portis app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  whalevault: {
    chainType: ChainPlatformType.eos,
    providerId: 'whalevault',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Whalevault requires logging in through the Whalevault app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  simpleos: {
    chainType: ChainPlatformType.eos,
    providerId: 'simpleos',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Simpleos requires logging in through the Simpleos app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  keycat: {
    chainType: ChainPlatformType.eos,
    providerId: 'Keycat',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Keycat requires logging in through the Keycat app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
}

export const ualProviderAttributesData: {
  [key: string]: UalProviderAttributes
} = {
  scatter: {
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: true,
    helpText: {
      login: 'Scatter requires logging in through the Scatter app.',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  ledger: {
    chainType: ChainPlatformType.eos,
    requiresLogin: true,
    supportsSignArbitrary: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      discover: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      versionsRequired:
        'You need to have recent versions of your browser, Ledger firmware, and the Ledger EOS app. Click here for more details.',
    },
  },
  lynx: {
    chainType: ChainPlatformType.eos,
    requiresLogin: false,
    supportsSignArbitrary: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  meetone: {
    chainType: ChainPlatformType.eos,
    requiresLogin: false,
    supportsSignArbitrary: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
  tokenpocket: {
    chainType: ChainPlatformType.eos,
    requiresLogin: false,
    supportsSignArbitrary: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: '',
    },
  },
}

export const providersNotImplemented = ['metro']

export const supportedTransitProviders = Object.keys(transitProviderAttributesData)
export const supportedUALProviders = Object.keys(ualProviderAttributesData)
