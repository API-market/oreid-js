import {
  AccountType,
  AuthProvider,
  ChainNetwork,
  ConvertOauthTokensParams,
  CustodialNewAccountParams,
  GetOreIdAuthUrlParams,
  GetOreIdRecoverAccountUrlParams,
  OreId,
  RecoverAccountAction,
} from '../src'

const newAccountCallbackUrl = `http://localhost:8080/newaccountcallback`

const getAuthUrl: GetOreIdAuthUrlParams = {
  // account,
  // accountType,
  // chainNetwork,
  // accountOptions,
  email: 'tray+0706@aikon.com',
  provider: AuthProvider.Email,
  callbackUrl: 'http://localhost:3000/authcallback',
  state: 'abc',
  returnAccessToken: true,
  returnIdToken: true,
}

// Republic test user (Staging)
const testUser: any = {
  appId: 't_504dfe37557746919cdf75c317f08ac2',
  apiKey: 't_kd32b3f2b532841389770a25e3ce86abc',
  // appId: null,
  // apiKey: null,
  userId: 'custodial|77028f286b6b798554cfbbdeb80f6f76',
  email: 'lievmhpk%40sharklasers.com', // 'lievmhpk@sharklasers.com',
  accountName: 'ore1rozonio3',
  accountId: 'af89027e-9c74-4170-accd-86d0e871abd8',
  walletId: 1949,
}

// Intialize oreId
// IMPORTANT - For a production app, you must protect your api key. A create-react-app app will leak the key since it all runs in the browser.
// To protect the key, you need to set-up a proxy server. See https://github.com/TeamAikon/ore-id-docs/tree/master/examples/react/advanced/react-server
const oreId = new OreId({
  appName: 'ORE ID Sample App',
  appId: testUser.appId || 'demo_0097ed83e0a54e679ca46d082ee0e33a',
  apiKey: testUser.apiKey || 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
  serviceKey: 't_k8889ced3cf2b4097a2bec7f90267d172',
  oreIdUrl: 'http://localhost:8080',
  // oreIdUrl: 'https://service.oreid.io',
  newAccountCallbackUrl,
})

const newAccountOptions = {
  account: '12345',
  accountType: AccountType.Native,
  chainNetwork: ChainNetwork.AlgoTest,
  provider: AuthProvider.Google,
  state: 'abc',
}

const recoverAccountOptions: GetOreIdRecoverAccountUrlParams = {
  // code,
  email: testUser.email,
  // phone,
  provider: AuthProvider.Email,
  callbackUrl: 'http://localhost:3000/callback',
  // backgroundColor,
  // state,
  account: testUser.accountName,
  recoverAction: RecoverAccountAction.Republic,
  // processId,
  // overrideAppAccessToken: 'e48aa0a5-2efb-4ca3-961c-062deb737e2d&',
}

const convertTokens: ConvertOauthTokensParams = {
  accessToken: null,
  idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2ZjhkNTVkYTUzNGVhOTFjYjJjYjAwZTFhZjRlOGUwY2RlY2E5M2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMxMDg1NzA2MzI2NzA5NDYyMjQiLCJlbWFpbCI6InRyYXkubGV3aW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJIRmZ5YWFCVnQtTS1BUVQzMkl2VndBIiwibmFtZSI6IlRyYXkgTGV3aW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2d6dDZYX2lYQ0tOQTNySG1fLWxEV3pPWGczV1NoVk5HOVFMdVpsPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlRyYXkiLCJmYW1pbHlfbmFtZSI6Ikxld2luIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MjU2MTI1OTcsImV4cCI6MTYyNTYxNjE5N30.VmXSyeGV955_h63MVvVaL-gJGXm0uHWwMIDqIGrWdDqJ-cxim70y7Is6mGP5YH361qMFGpt1N-96BrJtvutIa7park6aum9eOCTXiqlsx-WWQjKyfx7IaaQrMpY8JTzOdSzi0dsccqrNnoY4CbSnhp0JLdNk5lH8Efc6hXlUTBktyPlC2dspxoho9OgJOH-9XUu6RNgoYaYDEDBfdEx3BAqvXHqTMwGFygRA0hnB98WRWUsEZ6N30sGjA3HeooGozHLEiVrZlN8ie-_PxGwoONGoU_5v-fJOleV8a9_nyFlxyhb8SPnCPYkEgOCMxZyizL9MJRtJ6FA2RiBu8QOFVw',
}

const custodialNewAccount: CustodialNewAccountParams = {
  name: 'John Q Test',
  userName: 'jqtest',
  email: 'emailjq39@example.com',
  picture: 'https://nothing.com/nothing.jpg',
  userPassword: 'Password123!',
  phone: '+12223334444',
  accountType: AccountType.Native,
  idToken:
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI2ZjhkNTVkYTUzNGVhOTFjYjJjYjAwZTFhZjRlOGUwY2RlY2E5M2QiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDMxMDg1NzA2MzI2NzA5NDYyMjQiLCJlbWFpbCI6InRyYXkubGV3aW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJHNVRCUllpQklGS3RFb1lZSmdQZXdnIiwibmFtZSI6IlRyYXkgTGV3aW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2d6dDZYX2lYQ0tOQTNySG1fLWxEV3pPWGczV1NoVk5HOVFMdVpsPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IlRyYXkiLCJmYW1pbHlfbmFtZSI6Ikxld2luIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MjU2MTc1OTksImV4cCI6MTYyNTYyMTE5OX0.BEMXw5WRXcUpfZ67JSqO0pEqlm2eq7Lj_xLAR-eFrdsBuFeqpnD9ZRjD86j4M48XmU3cVyVJVLPeem81Z5KUFzRr4r59K7CBlW90DxCqNIMTpFSr99yP9rIHuOm4YlBHKqaqxeRHrPKna_FpWC5KfZ2gixN04FxdDpMInf8Jvjh69iaHEL3NRkekvzQUGjmVtMjgciFCTgiQfNY4z9-HtztD_u1aK4lxs2usT8FM633wSBN9F1Uu8_LiszDYO95me5S0Fq3HQPO5GO7Vmid0G_QNKUrFLQYKWEvJq_P5Yif-ZU89qbmMlTeJh9Cc45NLK1PGUzOv11dfGnFpwoQm5Q',
}

async function run() {
  // console.log(await oreId.getOreIdAuthUrl(getAuthUrl))
  // console.log(await oreId.convertOauthTokens(convertTokens))
  // console.log(await oreId.custodialNewAccount(custodialNewAccount))
  const { newAccountUrl } = await oreId.newAccount(newAccountOptions)
  console.log('newAccountUrl:', newAccountUrl)
  // const recoverAccountUrl = await oreId.getRecoverAccountUrl(recoverAccountOptions)
  // console.log('recoverAccountUrl:', recoverAccountUrl)
}

;(async () => {
  try {
    await run()
  } catch (error) {
    console.log('Error:', error)
  }
  process.exit()
})()
