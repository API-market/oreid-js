import OreId from '../src/core/oreId'
import { AuthProvider, ChainNetwork, AccountType } from '../src/models'
import { OreIdOptions } from '../src/core/IOreIdOptions'
import { defaultOreIdServiceUrl } from '../src/constants'

let oreId: OreId
let options: OreIdOptions

// use factories as this is good to ensure that the values ​​are these, and that the tests do not change the values
const getNewAccountOptions = () => ({
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
})

beforeEach(() => {
  options = {
    appName: 'testrunner',
    appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
    apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49', // has extra rights for examples (serviceKey)
    oreIdUrl: defaultOreIdServiceUrl,
    newAccountCallbackUrl: 'http://localhost.com',
    backgroundColor: '#fff',
  }
  oreId = new OreId(options)
})

test('Should create new account with oreid', async () => {
  const result = await oreId.auth.user.getNewChainAccountUrl(getNewAccountOptions())
  expect(result).toEqual({
    errors: null,
    newAccountUrl:
      'https://service.oreid.io/new-account#provider=google&chain_network=algo_test&callback_url=http%3A%2F%2Flocalhost.com&background_color=%23fff&state=abc&oauth_access_token=null&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&app_access_token=12345667&hmac=708e348348d3129cbb260bd3f84215643f3977284e68eb50c28707032061906f',
  })
})

// ! We must add other test cases here.
// ?! What if the API fails?
// ?! What if some field in newAccountOptions is missing?
