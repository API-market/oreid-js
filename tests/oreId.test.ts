/* eslint-disable jest/no-mocks-import */
import OreId from '../src/oreId'
import demoChainNetworks from '../src/testHelpers/__mocks__/chainNetworks.json'
import { OreIdOptions, AuthProvider } from '../src/models'
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

  describe('Errors without the required params', () => {
    it('Throws the correct message with no params', () => {
      const error = `Options are missing or invalid. 
 --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.`
      expect(() => {
        oreId = new OreId(null)
      }).toThrow(Error(error))
    })

    it('Throws an error without an appId', () => {
      const appIdError = `Options are missing or invalid. 
 --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.
 --> You cant include the apiKey (or serviceKey) when creating an instance of OreId that runs in the browser. This is to prevent your keys from being visible in the browser. If this app runs solely in the browser (like a Create React App), you need to set-up a proxy server to protect your keys. Refer to https://github.com/TeamAikon/ore-id-docs. Note: You wont get this error when using the appId and apiKey for a demo app (appId starts with demo_).`
      expect(() => {
        oreId = new OreId({ ...options, appId: '' })
      }).toThrowError(Error(appIdError))
    })
  })

  it('Doesnt error when it has the required values', () => {
    expect(oreId).toBeTruthy()
  })

  it('sets the chainNetworks correctly when initializing', async () => {
    await oreId.chainNetworks()
    expect(oreId.cachedChainNetworks).toEqual(demoChainNetworks)
  })

  describe('Login', () => {
    options = {
      ...options,
      authCallbackUrl: 'http://localhost.com',
      backgroundColor: '',
    }

    const loginOptions = {
      code: '12345',
      email: 'test@test.com',
      phone: '+1555555555',
      provider: AuthProvider.Google,
      state: 'abc',
    }

    beforeEach(() => {
      oreId = new OreId(options)
    })

    it('errors without `provider` and `callbackUrl`', async () => {
      try {
        await oreId.login({
          ...loginOptions,
          provider: null,
        })
      } catch (error) {
        expect(error.message).toBe('Missing a required parameter')
      }
    })

    it('Throws an error if the provider is not provided', async () => {
      try {
        await oreId.login({
          ...loginOptions,
          provider: null,
        })
      } catch (error) {
        expect(error.message).toBe('Missing a required parameter')
      }
    })

    it('logs in with oreid', async () => {
      const result = await oreId.login(loginOptions)
      expect(result).toEqual({
        errors: null,
        loginUrl:
          'https://service.oreid.io/auth#provider=google&code=12345&email=test%40test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&hmac=j1faPFT4zDNMssG4Gh13qDpz8n2QcQqBD0SuAGeoyy4%3D',
      })
    })

    it('Creates an HMAC', () => {
      const loginUrl =
        'https://service.oreid.io/auth#provider=google&code=12345&email=test@test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&app_access_token=12345667'
      const hmac = generateHmac('demo_k_97b33a2f8c984fb5b119567ca19e4a49', loginUrl)
      expect(hmac).toEqual('LIuhxTG3o6ZZPaqD2CA+NIZ9oi5Lg11lKJNPUsN+Yto=')
    })

    // describe('Logins with transit', () => {
    //   const fakeScatterProvider = {
    //     id: 'scatter'
    //   };

    //   options = {
    //     ...options,
    //     eosTransitWalletProviders: [fakeScatterProvider]
    //   };

    //   beforeEach(() => {
    //     oreId = new OreId(options);
    //   });

    //   it('tries to login with scatter', async () => {
    //     const result = await oreId.login({ ...loginOptions, provider: 'scatter' });
    //     expect(result).toEqual('');
    //   });
    // });
  })
})
