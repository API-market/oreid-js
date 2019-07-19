# oreid-js

ORE ID Helper library written in Javascript

# About

oreid-js is a javascript helper library for interacting with the Aikon ORE ID service.

[ORE ID](https://github.com/api-market/ore-id-docs) is a simple way to add OAuth login to your blockchain enabled app.

Install npm package:

```
npm install eos-auth
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
let signUrl = await oreId.getOreIdSignUrl({ account, transaction, signCallbackUrl, chain, state, broadcast, returnSignedTransaction });
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

# Using EOS Transit and/or UAL

eos-auth makes it easy for you to add many popular EOS wallets to your app. It integrates [EOS Transit](https://github.com/eosnewyork/eos-transit) and [UAL](https://github.com/EOSIO/universal-authenticator-library) so that you can use any wallet they support. eos-auth is the easiest way to use EOS Transit or UAL with your app.

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
| Scatter                    |  ✅           |  ✅  |
| Ledger                     |  ✅           |  ✅  |
| Lynx                       |  ✅           |  ✅  |
| Token Pocket               |  ✅           |  ✅  |
| Meet One                   |  ✅           |  ✅  |
| Keycat                     |  ✅           |  ❌  |
| Whalevault                 |  ✅           |  ❌  |
| Portis                     |  ✅           |  ❌  |

Check out the Express Server example for a complete example.

# Example projects

Refer to the examples folder in the [ore-id-docs](https://github.com/API-market/ore-id-docs) repo for the following sample projects

- ReactJS - A simple ReactJS website that includes React Login button component

- React Native - A React Native app that includes a React OAuth flow modal component

- Express Server - A simple Express server that includes the use of middleware to automate handling of callbacks

- React Passwordless - A simple ReactJS website to call the passwordless api
