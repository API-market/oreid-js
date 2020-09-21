# oreid-js

ORE ID Helper library written in Javascript

# About

oreid-js is a javascript helper library for interacting with the Aikon ORE ID service.

[ORE ID](https://github.com/api-market/ore-id-docs) is a simple way to add OAuth login to your blockchain enabled app.

Install npm package:

```
npm install oreid-js
```

# Usage

Example code:

```javascript
//Initialize the library
let oreId = new OreId({ appId, apiKey, oreIdUrl });

//Start the OAuth flow by setting the user's browser to this URL
let authUrl = await oreId.getOreIdAuthUrl({ provider, callbackUrl, backgroundColor });
//...then handle the callback results of the Auth flow
let authResults = oreId.handleAuthResponse(authCallbackResults);

//Request that the user sign a transaction by setting the user's browser to this URL
let signUrl = await oreId.getOreIdSignUrl({ account, transaction, signCallbackUrl, chainNetwork, ... });
//...then handle the callback results of the Sign flow
let signResults = oreId.handleSignResponse(signedCallbackResults);

//Get the user's info given a blockchain account
let userInfo = await oreId.getUserInfoFromApi(account);

```

# Express Middleware

This library includes Express middleware that you can use to simplify handling the callbacks from the ORE ID service.

```javascript
// authCallbackHandler middleware handles callback response from ORE ID and extracts results
app.use('/authcallback', authCallbackHandler(oreId) );
```

Check out the Express Server example for a complete example.

# For Ethereum chains

We support Ethereum and related test networks. Just use one of the following for chainNetwork parameter in the sign request. For example...
  - 'eth_main' - Etherem Main network
  - 'eth_ropsten' - Etherem Ropsten test network

# For Algorand chains

We support Algorand and related test networks. Just use one of the following for chainNetwork parameter in the sign request. For example...
  - 'algo_main' - Algorand Main network
  - 'algo_test' - Algorand test network
  - 'algo_beta' - Algorand Beta test network (future features)

NOTE: Algorand chains require an API Key (to be added to OreId options). You can get a free key by signing-up [here](https://www.purestake.com/technology/algorand-api/)

# For EOS chains

We support EOS, ORE, and other EOSIO-based chains. Just use one of the following for chainNetwork parameter in the sign request. For example...
  - 'eos_main' - Eos Main network
  - 'eos_kylin' - Eos Kylin test network
  - 'eos_jungle' - Eos Jungle test network
  - 'ore_main' - ORE Main network
  - 'ore_test' - ORE test network

## Using EOS Transit and/or UAL

oreid-js makes it easy for you to add many popular EOS wallets to your app. It integrates [EOS Transit](https://github.com/eosnewyork/eos-transit) and [UAL](https://github.com/EOSIO/universal-authenticator-library) so that you can use any wallet they support. oreid-js is the easiest way to use EOS Transit or UAL with your app.

EOS Transit
```javascript
// add the provider package for each wallet you want to support
import scatterProvider from 'eos-transit-scatter-provider';
// pass in the array of providers when you initialize the library
const eosTransitWalletProviders = [ scatterProvider(), ... ]
const oreId = new OreId({ ..., eosTransitWalletProviders });
```

UAL
```javascript
// add the provider package for each wallet you want to support
import { Scatter } from 'ual-scatter';
// pass in the array of providers when you initialize the library
const ualWalletProviders = [ Scatter, ... ]
let oreId = new OreId({ ..., ualWalletProviders });
```

**NOTE:** You can use both UAL and Transit together however you can't pass in duplicate providers. Using `ual-scatter` and `eos-transit-scatter-provider` at the same time will result in an error.


### Current Support

| Providers/Authenticators   | EOS Transit   | UAL  |
| -------------------------- |---------------|------|
| EOS - Keycat               |  ✅           |  ❌  |
| EOS - Ledger               |  ✅           |  ✅  |
| EOS - Lynx                 |  ✅           |  ✅  |
| EOS - Meet One             |  ✅           |  ✅  |
| EOS - Portis               |  ✅           |  ❌  |
| EOS - Scatter              |  ✅           |  ✅  |
| EOS - Token Pocket         |  ✅           |  ✅  |
| EOS - Whalevault           |  ✅           |  ❌  |
| Algorand - AlgoSigner      |  ✅           |  ❌  |

Check out the Express Server example for a complete example.

# Example projects

Refer to the examples folder in the [ore-id-docs](https://github.com/API-market/ore-id-docs) repo for the following sample projects

- ReactJS - A simple ReactJS website that includes React Login button component

- React Native - A React Native app that includes a React OAuth flow modal component

- Express Server - A simple Express server that includes the use of middleware to automate handling of callbacks

- React Passwordless - A simple ReactJS website to call the passwordless api
