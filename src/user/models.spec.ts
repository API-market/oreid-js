import { UserSourceData } from './models'

function isUserSourceData(obj: any): obj is UserSourceData {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value'
  )
}

const usd: UserSourceData = {
  accessToken: 'accessToken value',
  appId: 'appId value',
  backgroundColor: 'backgroundColor value',
  oreIdUrl: 'oreIdUrl value',
  eosTransitWalletProviders: ['eosTransitWalletProviders value'],
}

describe('User Source Data type', () => {
  test('type can be instantiated', () => {
    expect(isUserSourceData(usd)).toBeTruthy()
  })
})
