import OreId from './oreId';

import demoChainNetworks from './testHelpers/__mocks__/chainNetworks.json';

describe('OreId', () => {
  let oreId;
  let options = {
    appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
    apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
    oreIdUrl: 'https://service.oreid.io'
  };

  beforeEach(async () => {
    oreId = new OreId(options);
    await oreId.init();
  });

  describe('Errors without the required params', () => {
    it('Throws the correct message with no params', () => {
      const error = `Options are missing or invalid. 
 --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.
 --> Missing required parameter - apiKey. You can get an apiKey when you register your app with ORE ID.
 --> Missing required parameter - oreIdUrl. Refer to the docs to get this value.`;
      expect(() => {
        oreId = new OreId({});
      }).toThrow(Error(error));
    });

    it('Throws an error without an appId', () => {
      const appIdError = `Options are missing or invalid. 
 --> Missing required parameter - appId. You can get an appId when you register your app with ORE ID.`;
      expect(() => {
        oreId = new OreId({ ...options, appId: '' });
      }).toThrowError(Error(appIdError));
    });

    it('Throws an error without an apiKey', () => {
      const apiKeyError = `Options are missing or invalid. 
 --> Missing required parameter - apiKey. You can get an apiKey when you register your app with ORE ID.`;
      expect(() => {
        oreId = new OreId({ ...options, apiKey: '' });
      }).toThrowError(Error(apiKeyError));
    });

    it('Throws an error with a oreIdUrl', () => {
      const oreIdUrlError = `Options are missing or invalid. 
 --> Missing required parameter - oreIdUrl. Refer to the docs to get this value.`;
      expect(() => {
        oreId = new OreId({ ...options, oreIdUrl: '' });
      }).toThrowError(Error(oreIdUrlError));
    });
  });

  it('Doesnt error when it has the required values', () => {
    expect(oreId).toBeTruthy();
  });

  it('sets the chainNetworks correctly when initializing', async () => {
    await oreId.init();
    expect(oreId.chainNetworks).toEqual(demoChainNetworks);
  });

  describe('Login', () => {
    options = {
      ...options,
      authCallbackUrl: 'http://localhost.com',
      backgroundColor: ''
    };

    const loginOptions = {
      code: '12345',
      email: 'test@test.com',
      phone: '+1555555555',
      provider: 'google',
      state: 'CA'
    };

    beforeEach(async () => {
      oreId = new OreId(options);
      await oreId.init();
    });

    it('errors without `provider` and `callbackUrl`', async () => {
      try {
        await oreId.login({
          ...loginOptions,
          provider: ''
        });
      } catch (error) {
        expect(error.message).toBe('Missing a required parameter');
      }
    });

    it('Throws an error if the provider is not implemented', async () => {
      try {
        await oreId.login({
          ...loginOptions,
          provider: 'metro'
        });
      } catch (error) {
        expect(error.message).toBe('Not Implemented');
      }
    });

    it('logs in with oreid', async () => {
      const result = await oreId.login(loginOptions);
      expect(result).toEqual({
        errors: null,
        loginUrl: 'https://service.oreid.io/auth#app_access_token=12345667&provider=google&code=12345&email=test@test.com&phone=%2B1555555555&callback_url=http%3A%2F%2Flocalhost.com&background_color=&state=CA'
      });
    });

    // describe('Logins with transit', () => {
    //   const fakeScatterProvider = {
    //     id: 'scatter'
    //   };

    //   options = {
    //     ...options,
    //     eosTransitWalletProviders: [fakeScatterProvider]
    //   };

    //   beforeEach(async () => {
    //     oreId = new OreId(options);
    //     oreId.init();
    //   });

    //   it('tries to login with scatter', async () => {
    //     const result = await oreId.login({ ...loginOptions, provider: 'scatter' });
    //     expect(result).toEqual('');
    //   });
    // });
  });
});
