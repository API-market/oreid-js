/* eslint-disable jest/no-mocks-import */
import OreId from '../src/core/oreId'
import { OreIdOptions, AuthProvider, ChainNetwork, AccountType } from '../src/models'
import { defaultOreIdServiceUrl } from '../src/constants'

describe('OreId', () => {
  let oreId: OreId
  let options: OreIdOptions = {
    appName: 'testrunner',
    appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
    apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',, // has extra rights for examples (serviceKey)
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
      const result = await oreId.auth.user.getNewChainAccountUrl(newAccountOptions)
      expect(result).toEqual({
        errors: null,
        newAccountUrl:
          'http://localhost:8080/new-account#provider=google&chain_network=algo_test&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&oauth_access_token=null&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&app_access_token=12345667&hmac=3979b2bb92c0ac2212395220bd32babacb3d4d1e595c6f3c6b9c09504a67973f',
      })
    })

    it('create new account', async () => {
      const result = await oreId.auth.user.getNewChainAccountUrl(newAccountOptions)
      expect(result).toEqual({
        errors: null,
        newAccountUrl:
          'http://localhost:8080/new-account#provider=google&chain_network=algo_test&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&oauth_access_token=null&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&app_access_token=12345667&hmac=3979b2bb92c0ac2212395220bd32babacb3d4d1e595c6f3c6b9c09504a67973f',
      })
    })
  })
})
