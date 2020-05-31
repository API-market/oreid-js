export const transitProviderAttributes = {
  ledger: {
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
      versionsRequired: 'You need to have recent versions of your browser, Ledger firmware, and the Ledger EOS app. Click here for more details.'
    }
  },
  lynx: {
    providerId: 'EOS Lynx',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'EOS Lynx requires logging in through the EOS Lynx app.',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  meetone: {
    providerId: 'meetone_provider',
    requiresLogin: false,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  metro: {
    providerId: 'metro',
    requiresLogin: false,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  scatter: {
    providerId: 'scatter',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Scatter requires logging in through the Scatter app.',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  tokenpocket: {
    providerId: 'TokenPocket',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  portis: {
    providerId: 'PortisProvider',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Portis requires logging in through the Portis app.',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  whalevault: {
    providerId: 'whalevault',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Whalevault requires logging in through the Whalevault app.',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  simpleos: {
    providerId: 'simpleos',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: false,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Simpleos requires logging in through the Simpleos app.',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  keycat: {
    providerId: 'Keycat',
    requiresLogin: true,
    supportsDiscovery: false,
    supportsSignArbitrary: true,
    requiresLogoutLoginToDiscover: true,
    helpText: {
      login: 'Keycat requires logging in through the Keycat app.',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  }
};

export const ualProviderAttributes = {
  scatter: {
    requiresLogin: true,
    supportsSignArbitrary: true,
    helpText: {
      login: 'Scatter requires logging in through the Scatter app.',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  ledger: {
    requiresLogin: true,
    supportsSignArbitrary: false,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      discover: 'Connect and unlock your Ledger with your PIN code. Launch the EOS app on the device.',
      versionsRequired: 'You need to have recent versions of your browser, Ledger firmware, and the Ledger EOS app. Click here for more details.'
    }
  },
  lynx: {
    requiresLogin: false,
    supportsSignArbitrary: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  meetone: {
    requiresLogin: false,
    supportsSignArbitrary: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  },
  tokenpocket: {
    requiresLogin: false,
    supportsSignArbitrary: true,
    helpText: {
      login: 'This wallet doesn’t require you to login',
      sign: '',
      discover: '',
      versionsRequired: ''
    }
  }
};

export const providersNotImplemented = [
  'metro'
];

export const supportedTransitProviders = Object.keys(transitProviderAttributes);
export const supportedUALProviders = Object.keys(ualProviderAttributes);
