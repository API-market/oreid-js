import { defaultOreIdServiceUrl } from '../constants'
import { OreIdOptions } from '../core/IOreIdOptions'
import { AuthProvider } from '../models'
import demoChainNetworks from '../test-utils/chainNetworks.json'
import { generateHmac } from '../utils/hmac'
import OreId from './oreId'

// use factories as this is good to ensure that the values are these, and that the tests do not change the values
const getOptions = (): OreIdOptions => ({
  appName: 'testrunner',
  appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
  apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
  // apiKey: 't_k8889ced3cf2b4097a2bec7f90267d172', // has extra rights for examples (serviceKey)
  oreIdUrl: defaultOreIdServiceUrl,
  authCallbackUrl: 'http://localhost.com',
  backgroundColor: '#fff',
})

const getLoginOptions = () => ({
  code: '12345',
  email: 'test@test.com',
  phone: '+1555555555',
  provider: AuthProvider.Google,
  state: 'abc',
})

let oreId: OreId

beforeEach(() => {
  oreId = new OreId(getOptions())
})

test('Should not throw an error when it has the required values', () => {
  const oreIdTest = new OreId(getOptions())

  expect(oreIdTest).toBeTruthy()
})

test('Should sets the chainNetworks correctly when initializing', async () => {
  // ? Should we mock the API response? (Probably yes)
  const results = await oreId.getAllChainNetworkSettings()

  expect(results).toEqual(demoChainNetworks)
})

test('Should throws the correct message with no params', () => {
  const error = `Options are missing or invalid. 
 --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.`

  expect(() => {
    oreId = new OreId(null)
  }).toThrow(Error(error))
})

test('Should throws an error without an appId', () => {
  const appIdError = `Options are missing or invalid. 
 --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.`

  const param = { ...getOptions() }
  delete param.appId
  expect(() => {
    new OreId(param)
  }).toThrowError(Error(appIdError))
})

describe('Login actions', () => {
  test('Should throw an error without `provider` and `callbackUrl`', async () => {
    const options = getLoginOptions()
    delete options.provider

    await expect(async () => {
      await oreId.auth.getLoginUrl(options)
    }).rejects.toThrow(Error('Missing a required parameter'))
  })

  test('Should throw an error if the provider is not provided', async () => {
    const options = getLoginOptions()
    delete options.provider

    await expect(async () => {
      await oreId.auth.getLoginUrl(options)
    }).rejects.toThrow(Error('Missing a required parameter'))
  })

  test('Should logs in with oreid', async () => {
    const result = await oreId.auth.getLoginUrl(getLoginOptions())
    expect(result).toEqual({
      errors: null,
      loginUrl:
        'https://service.oreid.io/auth#provider=google&code=12345&email=test%40test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=%23fff&state=abc&return_access_token=true&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&hmac=85026a8c92321e5ee450b3a89a7b5d5c152a5f63e949962b174a17dc40ed2792',
    })
  })

  test('Should create an HMAC', () => {
    const loginUrl =
      'https://service.oreid.io/auth#provider=google&code=12345&email=test@test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&app_access_token=12345667'
    const hmac = generateHmac('demo_k_97b33a2f8c984fb5b119567ca19e4a49', loginUrl)
    expect(hmac).toEqual('2c8ba1c531b7a3a6593daa83d8203e34867da22e4b835d6528934f52c37e62da')
  })
})
