import demoChainNetworks from './chainNetworks.json';

const axios = {
  get: jest.fn().mockImplementation((url, options) => {
    if (url.includes('services/config?type=chains')) {
      if (options.headers['api-key'] === 'demo_k_97b33a2f8c984fb5b119567ca19e4a49') {
        return {
          data: {
            values: {
              chains: demoChainNetworks
            }
          }
        };
      }
    }
  })
}

export default axios;