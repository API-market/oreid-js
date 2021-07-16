/* eslint-disable jest/no-mocks-import */
import OreId from '../src/oreId'
import demoChainNetworks from '../src/testHelpers/__mocks__/chainNetworks.json'
import { OreIdOptions, AuthProvider, ChainNetwork, AccountType } from '../src/models'
import { generateHmac } from '../src/hmac'
import { defaultOreIdServiceUrl } from '../src/constants'

describe('OreId', () => {
  let oreId: OreId
  let options: OreIdOptions = {
    appName: 'testrunner',
    appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
    apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
    oreIdUrl: defaultOreIdServiceUrl,
  }

  beforeEach(() => {
    oreId = new OreId(options)
  })

  describe('New Account', () => {
    options = {
      ...options,
      newAccountCallbackUrl: 'http://localhost.com',
      backgroundColor: '',
    }

    const newAccountOptions = {
      account: '12345',
      accountType: AccountType.Native,
      chainNetwork: ChainNetwork.AlgoTest,
      provider: AuthProvider.Google,
      accountOptions: {
        multisigOptions: {
          version: 1,
          threshold: 2,
          addrs: [
            '6LENQTC2YXJE4THQXTV2TJUSEDJGWICKOYATWKM5VOIZLHIVPMU7BVIRSE',
            'ME7ZZKR6O2HMLP2PQEK2Z3Z5FQ4L3RNYDRDAOOJZVPEECBRJRKN7MCGHQA',
            'VTXARSXNMOD7YUZINOCH2XJBMAUD332F7ECLD25RWGOKCILAHTVMZPUDVU',
          ],
        },
      },
      state: 'abc',
    }

    beforeEach(() => {
      oreId = new OreId(options)
    })

    it('create new account with oreid', async () => {
      const result = await oreId.newAccountWithOreId(newAccountOptions)
      expect(result).toEqual({
        errors: null,
        newAccountUrl:
          'https://service.oreid.io/new-account#provider=google&chain_network=algo_test&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&app_access_token=12345667&hmac=P10z%2B1YPZhqupla8eM7F%2BA7Trnet3o7sYvt%2BvJzB1DQ%3D',
      })
    })

    xit('create new account with oreid', async () => {
      const result = await oreId.newAccount(newAccountOptions)
      expect(result).toEqual({
        errors: null,
        loginUrl:
          'https://service.oreid.io/new-account#provider=google&chain_network=algo_test&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&app_access_token=12345667&hmac=P10z%2B1YPZhqupla8eM7F%2BA7Trnet3o7sYvt%2BvJzB1DQ%3D',
      })
    })
  })
})
