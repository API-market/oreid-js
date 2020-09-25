import { AuthProvider, ChainPlatformType } from './types'

export type UalProviderAttributes = {
  providerName: AuthProvider
  providerUALName: string
  chainType: ChainPlatformType
  requiresLogin: boolean
  supportsSignArbitrary: boolean
  helpText: {
    login: string
    sign: string
    discover: string
    versionsRequired: string
  }
}

export const ualProviderAttributesData: UalProviderAttributes[] = [
  {
    providerName: AuthProvider.Ledger,
    providerUALName: 'Ledger',
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
  {
    providerName: AuthProvider.Lynx,
    providerUALName: 'Lynx',
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
  {
    providerName: AuthProvider.Scatter,
    providerUALName: 'Scatter',
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
  {
    providerName: AuthProvider.TokenPocket,
    providerUALName: 'Token Pocket',
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
]

/** Get provider-specific settings and metadata */
export function getUALProviderAttributes(provider: AuthProvider): UalProviderAttributes {
  return ualProviderAttributesData.find(up => up.providerName === provider.toString())
}

/** Get provider-specific settings and metadata by the UAL provider name */
export function getUALProviderAttributesByUALName(providerName: string): UalProviderAttributes {
  return ualProviderAttributesData.find(up => up.providerName === providerName)
}

export const supportedUALProviders: AuthProvider[] = ualProviderAttributesData.map(tp => tp.providerName)
