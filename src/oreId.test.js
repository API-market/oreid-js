import OreId from './oreId';

import demoChainNetworks from './testHelpers/__mocks__/chainNetworks.json';

describe('OreId', () => {
  let oreId;
  const options = {
    appId: 'demo_0097ed83e0a54e679ca46d082ee0e33a',
    apiKey: 'demo_k_97b33a2f8c984fb5b119567ca19e4a49',
    oreIdUrl: 'https://service.oreid.io'
  };

  beforeEach(() => {
    oreId = new OreId(options);
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
});
