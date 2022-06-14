import demoChainNetworks from '../chainNetworks.json'

// If we want full integration tests we can erase this file and make a real
// API call everytime the tests are run.
const axios = {
  get: jest.fn().mockImplementation((url, options) => {
    // DEMO API_KEY used for oreid.test.js
    if (options.headers['api-key'] === 'demo_k_97b33a2f8c984fb5b119567ca19e4a49') {
      if (url.includes('services/config?type=chains')) {
        return {
          data: {
            values: {
              chains: demoChainNetworks,
            },
          },
        }
      }
    }
    return null
  }),
  post: jest.fn().mockImplementation((url, options, { headers }) => {
    // DEMO API_KEY used for oreid.test.js
    if (headers['api-key'] === 'demo_k_97b33a2f8c984fb5b119567ca19e4a49') {
      if (url.includes('app-token')) {
        return {
          data: {
            appAccessToken: '12345667',
          },
        }
      }
    }
    return null
  }),
}

export default axios
