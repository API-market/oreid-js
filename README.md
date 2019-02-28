# oreid-js
ORE ID Helper library written in Javascript

# About

oreid-js is a javascript helper library for interacting with the Aikon ORE ID service.

[ORE ID](https://github.com/api-market/ore-id-docs) is a simple way to add OAuth login to your blockchain enabled app.

Install npm package:
```
npm install @api-market/oreid-js
```


# Usage


Example code:
```
//Initialize the library
let oreId = new OreId({ appId, apiKey, oreIdUrl });

//Start the OAuth flow by setting the user's browser to this URL
let authUrl = await oreId.getOreIdAuthUrl({ provider, callbackUrl, backgroundColor });
//...then handle the callback results of the Auth flow
let authResults = oreId.handleAuthResponse(authCallbackResults);

//Request that the user sign a transaction by setting the user's browser to this URL
let signUrl = await oreId.getOreIdSignUrl({ account, transaction, signCallbackUrl, chain, state, broadcast });
//...then handle the callback results of the Sign flow
let signResults = oreId.handleSignResponse(signedCallbackResults);

//Get the user's info given a blockchain account
let userInfo = await oreId.getUserInfoFromApi(account);

```

# Express Middleware

This library includes Express middleware that you can use to simplify handling the callbacks from the ORE ID service.

```
// authCallbackHandler middleware handles callback response from ORE ID and extracts results
app.use('/authcallback', authCallbackHandler(oreId) );
```

Check out the Express Server example for a complete example.


# Example projects

Refer to the examples folder in the [ore-id-docs](https://github.com/API-market/ore-id-docs) repo for the following sample projects

- ReactJS - A simple ReactJS website that includes React Login button component

- React Native - A React Native app that includes a React OAuth flow modal component

- Express Server - A simple Express server that includes the use of middleware to automate handling of callbacks