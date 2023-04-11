import { ExternalWalletInterface, WalletProviderAttributes } from './models'
import { ExternalWalletType, ChainPlatformType } from '../models'

function isWalletProviderAttributes(obj: any): obj is WalletProviderAttributes {
  return (
    'providerName' in obj &&
    obj.providerName === 'algosigner' &&
    'chainType' in obj &&
    obj.chainType === 'algorand' &&
    'providerId' in obj &&
    obj.providerId === 'providerId value' &&
    'requiresLogin' in obj &&
    obj.requiresLogin &&
    'supportsDiscovery' in obj &&
    obj.supportsDiscovery &&
    'supportsSignArbitrary' in obj &&
    obj.supportsSignArbitrary &&
    'requiresLogoutLoginToDiscover' in obj &&
    obj.requiresLogoutLoginToDiscover &&
    'requiresDiscoverToLogin' in obj &&
    obj.requiresDiscoverToLogin &&
    'helpText' in obj &&
    'login' in obj.helpText &&
    obj.helpText.login === 'login value' &&
    'sign' in obj.helpText &&
    obj.helpText.sign === 'sign value' &&
    'discover' in obj.helpText &&
    obj.helpText.discover === 'discover value' &&
    'versionsRequired' in obj.helpText &&
    obj.helpText.versionsRequired === 'versionsRequired value' &&
    'logoUrl' in obj &&
    obj.logoUrl === 'logoUrl value'
  )
}

const wpa: WalletProviderAttributes = {
  providerName: ExternalWalletType.AlgoSigner,
  chainType: ChainPlatformType.algorand,
  providerId: 'providerId value',
  requiresLogin: true,
  supportsDiscovery: true,
  supportsSignArbitrary: true,
  requiresLogoutLoginToDiscover: true,
  requiresDiscoverToLogin: true,
  helpText: {
    login: 'login value',
    sign: 'sign value',
    discover: 'discover value',
    versionsRequired: 'versionsRequired value',
  },
  logoUrl: 'logoUrl value',
}

describe('Wallet Provider Attributes type', () => {
  test('type can be instantiated', () => {
    expect(isWalletProviderAttributes(wpa)).toBeTruthy()
  })

  test('enum can be snapshotted', () => {
    expect(ExternalWalletInterface).toMatchInlineSnapshot(`
      Object {
        "Transit": "transit",
        "Ual": "ual",
      }
    `)
  })
})
