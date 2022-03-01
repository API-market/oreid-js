/* eslint-disable jest/no-mocks-import */
import OreId from '../src/core/oreId'
import demoChainNetworks from '../src/testHelpers/__mocks__/chainNetworks.json'
import { OreIdOptions, AuthProvider } from '../src/models'
import { generateHmac } from '../src/utils/hmac'
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
    await oreId.getChainNetworks()
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
      await expect(async () => {
        await oreId.auth.getLoginUrl({
          ...loginOptions,
          provider: null,
        })
      }).rejects.toThrow(Error('Missing a required parameter'))
    })

    it('Throws an error if the provider is not provided', async () => {
      await expect(async () => {
        await oreId.auth.getLoginUrl({
          ...loginOptions,
          provider: null,
        })
      }).rejects.toThrow(Error('Missing a required parameter'))
    })

    it('logs in with oreid', async () => {
      const result = await oreId.auth.getLoginUrl(loginOptions)
      expect(result).toEqual({
        errors: null,
        loginUrl:
          'https://service.oreid.io/auth#provider=google&code=12345&email=test%40test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&return_access_token=true&app_id=demo_0097ed83e0a54e679ca46d082ee0e33a&hmac=e97f04950953fb1725dcf1a15871234e12fa47cec72f4d7c5a061b5bb867aed7',
      })
    })

    it('Fails to log in with expired idToken', async () => {
      const idToken =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI4MkYxRUU1NTdCMTAwNDVEMTVDMTg2RUFBQzlCQ0VBMkNBNTZBQzIifQ.eyJuYW1lIjoiVHJheSBMZXdpbiIsIm5pY2tuYW1lIjoidHJheSIsInBpY3R1cmUiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vc3RhZ2luZy1vcmVpZC1maWxlcy9pbWFnZXMvdXNlci1nb29nbGUtb2F1dGgyfDEwNzIyMDYzODAzOTI2MTkwNDY0MS1wcm9maWxlIiwidXBkYXRlZF9hdCI6IjIwMjItMDItMDlUMTQ6NDY6MDAuOTAzWiIsImVtYWlsIjoidHJheUBhaWtvbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vc3RhZ2luZy5vcmVpZC5pby8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNzIyMDYzODAzOTI2MTkwNDY0MSIsImF1ZCI6WyJodHRwczovL3N0YWdpbmcuc2VydmljZS5vcmVpZC5pbyIsImh0dHBzOi8vc3RhZ2luZy5zZXJ2aWNlLm9yZWlkLmlvL3VzZXJpbmZvIiwiaHR0cHM6Ly9vcmVpZC1zdGFnaW5nLmFpa29uLmNvbSIsImh0dHBzOi8vYWlrb24tc3RhZ2luZy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vYXBwSWQiOiJhZG1pbi02MjllLTQ3MTktOTIwNi0wMmJmOWVkY2FhMjgiLCJodHRwczovL29yZWlkLmFpa29uLmNvbS9wcm92aWRlciI6Imdvb2dsZSIsImh0dHBzOi8vb3JlaWQuYWlrb24uY29tL2FjY291bnQiOiJvcmUxcms0MmQzYWciLCJodHRwczovL29yZWlkLmFpa29uLmNvbS9hZG1pblNlcnZpY2UiOiJhaWtvbi1hZG1pbiIsImlhdCI6MTY0NTU3NzAwMywiZXhwIjoxNjQ1NjYzNDAzfQ.I0jwkN5drAcjrdsly78KSDezNoPGjuEDIJHd0QS_ddx-tVjWiSlkNXKaH1ZHJDCNNlKKdZUlz5LfAraoLaTTVingva2VQljFsFDWoT6dYcQ9BJui5AJUSL5Q5ufha5mSSPint-jOVuN-WcaMXJdFLbcNDcNYUx74hn1U-6OBSsjHzVegWH_VHRn1tAoMkbFPSDVnP3rQtj6Nyiwk0BaEKwUeOj2Jf_hNIUzoC9eHvhAr_eCx4K0ll8rhnhkmXKkcMQZNsRg1NLKJWKKpUymCgfn40EGtn_xMLs1qd1U_IgeKYde7RGlzk8t6NEbbCKy4Z9JBdjNL9ipzcQ98kY9VDG6bCX5qnGN9qj29vghbOdbgNJ9BKkadFBzHW4PF-7pLT8Q5p6oJf77cKF8yhTzZEnEQeQ-ELYNOTiIpYIPhBs0btG95Y2D8yHffzIXBxlWOb05b7O6Z9IehSPfcQ9LvD8n46PEymNBmitbmpx6WV3RRdwrrRojShaVAYr2lpLQL9O1pb3BYOo17rmXMMzMhAIF_d7Pw1hRitN-aM4Q1_FGNEBvHS6RumoB5CIkJYOwP_WB5AVbS-JEaSLwGbEMG0QGJjg1lWrMrFvNyfYnQdCMS80Sh8FGKT5fdrSnkpWYrU-T6Pjq9IWCnE2BsKkc9VMvTQa922pKLV21UkBcqSJA'
      const result = await oreId.auth.loginWithIdToken({ idToken })
      expect(result).toEqual({
        error: 'token_expired',
        accessToken: null,
        message: 'idToken provided is expired',
        processId: undefined,
      })
    })

    // it('logs in with valid idToken', async () => {
    //   const idToken =
    //     'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjI4MkYxRUU1NTdCMTAwNDVEMTVDMTg2RUFBQzlCQ0VBMkNBNTZBQzIifQ.eyJuYW1lIjoiVHJheSBMZXdpbiIsIm5pY2tuYW1lIjoidHJheSIsInBpY3R1cmUiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vc3RhZ2luZy1vcmVpZC1maWxlcy9pbWFnZXMvdXNlci1nb29nbGUtb2F1dGgyfDEwNzIyMDYzODAzOTI2MTkwNDY0MS1wcm9maWxlIiwidXBkYXRlZF9hdCI6IjIwMjItMDItMDlUMTQ6NDY6MDAuOTAzWiIsImVtYWlsIjoidHJheUBhaWtvbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vc3RhZ2luZy5vcmVpZC5pby8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNzIyMDYzODAzOTI2MTkwNDY0MSIsImF1ZCI6WyJodHRwczovL3N0YWdpbmcuc2VydmljZS5vcmVpZC5pbyIsImh0dHBzOi8vc3RhZ2luZy5zZXJ2aWNlLm9yZWlkLmlvL3VzZXJpbmZvIiwiaHR0cHM6Ly9vcmVpZC1zdGFnaW5nLmFpa29uLmNvbSIsImh0dHBzOi8vYWlrb24tc3RhZ2luZy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vYXBwSWQiOiJhYWFhYWFhLTUwMWMtNGVlYi1hMzU1LWJiYWE4Y2ZhMjU5NyIsImh0dHBzOi8vb3JlaWQuYWlrb24uY29tL3Byb3ZpZGVyIjoiZ29vZ2xlIiwiaHR0cHM6Ly9vcmVpZC5haWtvbi5jb20vYWNjb3VudCI6Im9yZTFwcXFiemdrbyIsImh0dHBzOi8vb3JlaWQuYWlrb24uY29tL2FkbWluU2VydmljZSI6ImFpa29uLWFkbWluIiwiaWF0IjoxNjQ2MDIxNTk2LCJleHAiOjE2NDYxMDc5OTZ9.mBEr4KI5zIuTFcp41k_gRRZDch3-voMaFO1tCDLIR4S803qUJowSfAFA8Tmo-PLVrSkZZtoY7LHJf5Qv4R-AzNBF-I_wLkql09dwlmdimx80taZsMkRJRFmo9webqd116YCmy2ZG9Gc9zs5Iy6KDuVbOOrV-P2ya1t-sy1We2wjQaJkddFUlp7SPTvxGZL_OiMuaP6da4H9d-0904A_iwEx1exexg42iAHx2goOFxVLgKhBK91PO0pJ3JNO-BmzldsedqKH5AH8z0zCFsW4mkW33L0JCZh-V4sVGP1xVzmaq6frpym1Je9CCChj09zo_A0ySUenw2QJYZsI1idtBlc7acQb5v_5CBV8hywZJUjbvyjyGpm_XMihNuSmtt-yxW9O4ly6qCL4ql0DF6icYutvWKX-jSJHimm2_Y0E5E-1feueYArGFDOyuP4bvAajwtngKJtwCkoNImDxnAiYIMALkdTGRpr-0DdKv2cjrnNfiam4aTEom4OCjCezS2qaQxPdDLdcR7CtAqpto8yxyT_nYsKTtJXCPpKwjo12YLo_z9x3OL5mJsl5XKdBhIBJrY7L00wIcwKaeQUMkprH_1HY65h5Ak4Fnag0PSer7zMiIbJpM_I2ddtUUeyRvuTxGNLlN6U4Da6UgGcf0xJdfxiJMZRG7hda_szNCpsbXlfc'
    //   const result = await oreId.auth.loginWithIdToken({ idToken })
    //   expect(result).toEqual({
    //     error: 'token_expired',
    //     accessToken: null,
    //     message: 'idToken provided is expired',
    //     processId: undefined,
    //   })
    // })

    it('Creates an HMAC', () => {
      const loginUrl =
        'https://service.oreid.io/auth#provider=google&code=12345&email=test@test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=abc&app_access_token=12345667'
      const hmac = generateHmac('demo_k_97b33a2f8c984fb5b119567ca19e4a49', loginUrl)
      expect(hmac).toEqual('2c8ba1c531b7a3a6593daa83d8203e34867da22e4b835d6528934f52c37e62da')
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
