import { AccountType, AuthProvider, ChainNetwork, OreId, RecoverAccountAction } from './src'

const newAccountCallbackUrl = `http://localhost:4000/newaccountcallback`

// Intialize oreId
// IMPORTANT - For a production app, you must protect your api key. A create-react-app app will leak the key since it all runs in the browser.
// To protect the key, you need to set-up a proxy server. See https://github.com/TeamAikon/ore-id-docs/tree/master/examples/react/advanced/react-server
const oreId = new OreId({
  appName: 'ORE ID Sample App',
  appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
  apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
  oreIdUrl: 'http://localhost:8080',
  newAccountCallbackUrl,
})

const newAccountOptions = {
  account: '12345',
  accountType: AccountType.Native,
  chainNetwork: ChainNetwork.AlgoTest,
  provider: AuthProvider.Google,
  accountOptions: {
    multisigOptions: {
      version: 1,
      threshold: 2,
      ore1ro3qvdjvaddrs: [
        '6LENQTC2YXJE4THQXTV2TJUSEDJGWICKOYATWKM5VOIZLHIVPMU7BVIRSE',
        'ME7ZZKR6O2HMLP2PQEK2Z3Z5FQ4L3RNYDRDAOOJZVPEECBRJRKN7MCGHQA',
        'VTXARSXNMOD7YUZINOCH2XJBMAUD332F7ECLD25RWGOKCILAHTVMZPUDVU',
      ],
    },
  },
  state: 'abc',
}

const recoverAccountOptions = {
  // code,
  email: 'tray@aikon.com',
  // phone,
  provider: AuthProvider.Email,
  callbackUrl: 'http://localhost:3001/authcallback',
  // backgroundColor,
  // state,
  account: '',
  recoverAction: RecoverAccountAction.Republic,
  // processId,
}

async function run() {
  // const { newAccountUrl } = await oreId.newAccount(recoverAccountOptions)
  // console.log('newAccountUrl:', newAccountUrl)
  const recoverAccountUrl = await oreId.getRecoverAccountUrl(recoverAccountOptions)
  console.log('recoverAccountUrl:', recoverAccountUrl)
}

;(async () => {
  try {
    await run()
  } catch (error) {
    console.log('Error:', error)
  }
  process.exit()
})()
