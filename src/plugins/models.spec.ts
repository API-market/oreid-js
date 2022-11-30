import { PluginType } from './models'

function isPluginType(obj: any): obj is PluginType {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value'
  )
}

const pt: PluginType = {
  accessToken: 'accessToken value',
  appId: 'appId value',
  backgroundColor: 'backgroundColor value',
  oreIdUrl: 'oreIdUrl value',
  eosTransitWalletProviders: ['eosTransitWalletProviders value'],
}

describe('Plugin Type type', () => {
  test('type can be instantiated', () => {
    expect(isPluginType(pt)).toBeTruthy()
  })
})
