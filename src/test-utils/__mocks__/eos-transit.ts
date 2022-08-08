// This might be better mocked out as a class so we can make changes to state like
// `connected`, `authenticated`, etc.
const initWallet = jest.fn().mockImplementation(context => {
  if (context.id === 'scatter') {
    return {
      accountInfo: '',
      active: false,
      auth: '',
      authenticated: false,
      connect: jest.fn(),
      connected: false,
      ctx: {
        appName: 'ORE ID Sample App',
        eosRpc: jest.fn(),
        network: {
          chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
          host: 'api-kylin.eosasia.one',
          port: '443',
          protocol: 'https',
        },
        initWallet: jest.fn(),
        addWalletProvider: jest.fn(),
      },
      disconnect: jest.fn(),
      discover: jest.fn(),
      eosApi: {
        contracts: new Map([]),
        cachedAbis: new Map([]),
        rpc: jest.fn(),
      },
      errorMessage: '',
      fetchAccountInfo: jest.fn(),
      hasError: false,
      inProgress: false,
      login: jest.fn(),
      logout: jest.fn(),
      provider: {
        id: 'scatter',
        meta: {},
        signatureProvider: {},
      },
      signArbitrary: jest.fn(),
      subscribe: jest.fn(),
      terminate: jest.fn(),
      _instanceId: '0eb15d9f-f954-469e-ba56-1i416ed9d6d8',
    }
  }
  return null
})

const initAccessContext = jest.fn().mockImplementation(context => {
  if (context) {
    return {
      addWalletProvider: jest.fn(),
      appName: 'ORE ID Sample App',
      destroy: jest.fn(),
      detachWallet: jest.fn(),
      disconnectAll: jest.fn(),
      eosRpc: {
        endpoint: 'https://api-kylin.eosasia.one:443',
        fetchBuiltin: jest.fn(),
      },
      getActiveWallets: jest.fn(),
      getWalletProviders: jest.fn().mockReturnValue(context.walletProviders),
      getWallets: jest.fn(),
      initWallet,
      logoutAll: jest.fn(),
      network: {
        host: 'api-kylin.eosasia.one',
        port: '443',
        protocol: 'https',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
      },
      subscribe: jest.fn(),
      terminateAll: jest.fn(),
    }
  }
  return null
})

export {
  initAccessContext, // eslint-disable-line import/prefer-default-export
}
