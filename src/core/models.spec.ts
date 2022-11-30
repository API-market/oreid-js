import { ConfigType } from './models'

function isConfigType(obj: any): obj is ConfigType {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value'
  )
}

const ct: ConfigType = {
  accessToken: 'accessToken value',
  appId: 'appId value',
  backgroundColor: 'backgroundColor value',
  oreIdUrl: 'oreIdUrl value',
  eosTransitWalletProviders: ['eosTransitWalletProviders value'],
}

describe('Config Type type', () => {
  test('type can be instantiated', () => {
    expect(isConfigType(ct)).toBeTruthy()
  })
})
