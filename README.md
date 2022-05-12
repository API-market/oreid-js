# oreid-js

ORE ID Helper library written in Javascript

# About

oreid-js is a javascript helper library for interacting with the Aikon ORE ID service.

[ORE ID](https://github.com/api-market/ore-id-docs) is a simple way to add OAuth login to your blockchain enabled app.

Install this npm package as well as the related oreid-webpopup package:

```
yarn add oreid-js oreid-webpopup

```

# Usage

Example code:

```javascript
// import this library and the Web popup widget
import { OreId } from "oreid-js";
import { WebPopup } from "oreid-webpopup";
```

```javascript
// Initialize libraries
const oreId = new OreId({ appId, apiKey, plugins:{ popup: WebPopup() }});
oreId.init().then(
  // oreId is ready
);
```

## Auth
```javascript
// launch popup for user to login
oreId.popup.auth({ provider })
  .then(onSuccess)
  .catch(onError);
```
## User
```javascript
// access logged-in user info
const userData = await oreid.auth.user.getData();
console.log(`Hello ${userData.name}`);
```

## Transaction
```javascript
// Get the first Ethereum account in the user's account
const ethAccount = user.data.chainAccounts.find(ca => ca.chainNetwork === 'eth_ropsten');

// create and sign transaction
const transaction = await oreid.createTransaction({
  chainAccount: ethAccount,
  chainNetwork: 'eth_ropsten',
  transaction: { to: '0x123...', amount: '.0001' },
  signOptions: { broadcast: true }
});

// launch popup for sign flow - when completed, transaction info is returned
oreId.popup.sign({ transaction })
  .then((results) => { console.log('txId:', results.transactionId)}),
  .catch(error => { ... });

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
  - 'eth_rinkeby' - Etherem Rinkeby test network

# For Algorand chains

We support Algorand and related test networks. Just use one of the following for chainNetwork parameter in the sign request. For example...
  - 'algo_main' - Algorand Main network
  - 'algo_test' - Algorand test network
  - 'algo_beta' - Algorand Beta test network (upcoming features)

NOTE: Algorand chains require an API Key (to be added to OreId options). You can get a free key by signing-up [here](https://www.purestake.com/technology/algorand-api/)

# For EOS chains

We support EOS, ORE, and other EOSIO-based chains. Just use one of the following for chainNetwork parameter in the sign request. For example...
  - 'eos_main' - Eos Main network
  - 'eos_kylin' - Eos Kylin test network
  - 'eos_jungle' - Eos Jungle test network
  - 'ore_main' - ORE Main network
  - 'ore_test' - ORE test network

## Using EOS Transit

oreid-js makes it easy for you to add many popular blockchain wallets to your app. It integrates [EOS Transit](https://github.com/eosnewyork/eos-transit) so that you can use any wallet they support. oreid-js is the easiest way to add support for signing with blockchain wallets to your app.

EOS Transit
```javascript
// add the provider package for each wallet you want to support
import scatterProvider from 'eos-transit-scatter-provider';
// pass in the array of providers when you initialize the library
const eosTransitWalletProviders = [ scatterProvider(), ... ]
const oreId = new OreId({ ..., eosTransitWalletProviders });
```

**NOTE:** This project uses a forked version of Eos-Transit library to support non-Eos blockchains (package: @aikon/eos-transit).

<br>

### Current Support
| Providers/Authenticators   |
| -------------------------- |
| Algorand - AlgoSigner      |
| Ethereum - web3 (Metamask) |
| Ethereum - walletConnect   |
| EOS - Keycat               |
| EOS - Ledger               |
| EOS - Lynx                 |
| EOS - Meet One             |
| EOS - Portis               |
| EOS - Scatter              |
| EOS - Token Pocket         |
| EOS - Whalevault           |

Check out the Express Server example for a complete example.
<br><br>

# Example projects

Refer to the examples folder in the [ore-id-docs](https://github.com/API-market/ore-id-docs) repo for the following sample projects

- ReactJS - A simple ReactJS website that includes React Login button component

- React Native - A React Native app that includes a React OAuth flow modal component

- Express Server - A simple Express server that includes the use of middleware to automate handling of callbacks

- React Passwordless - A simple ReactJS website to call the passwordless api
