import { WebWidgetOreIdOptions } from './models'

function isWebWidgetOreIdOptions(obj: any): obj is WebWidgetOreIdOptions {
  return (
    'accessToken' in obj &&
    obj.accessToken === 'accessToken value' &&
    'appId' in obj &&
    obj.appId === 'appId value' &&
    'backgroundColor' in obj &&
    obj.backgroundColor === 'backgroundColor value' &&
    'oreIdUrl' in obj &&
    obj.oreIdUrl === 'oreIdUrl value' &&
    'setBusyCallback' in obj &&
    'eosTransitWalletProviders' in obj &&
    Array.isArray(obj.eosTransitWalletProviders) &&
    obj.eosTransitWalletProviders.length == 1 &&
    obj.eosTransitWalletProviders[0] === 'eosTransitWalletProviders value'
  )
}

const wwoo: WebWidgetOreIdOptions = {
  accessToken: 'accessToken value',
  appId: 'appId value',
  backgroundColor: 'backgroundColor value',
  oreIdUrl: 'oreIdUrl value',
  eosTransitWalletProviders: ['eosTransitWalletProviders value'],
}

wwoo.setBusyCallback = () => console.log(`done`)

describe('Web Widget OreId Options type', () => {
  test('type can be instantiated', () => {
    expect(isWebWidgetOreIdOptions(wwoo)).toBeTruthy()

    const setBusyCallbackMock = jest.fn(() => true)
    expect(wwoo.setBusyCallback({ isBusy: setBusyCallbackMock })).toBeTruthy()
  })

  // test('enum can be snapshotted', () => {
  //   expect(ExternalWalletInterface).toMatchInlineSnapshot(`
  //     Object {
  //       "Transit": "transit",
  //       "Ual": "ual",
  //     }
  //   `)
  // })
})
