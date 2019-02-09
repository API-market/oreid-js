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
let authUrl = await oreId.getOreIdAuthUrl({ loginType, callbackUrl, backgroundColor });
//...then handle the callback results of the Auth flow
let authResults = oreId.handleAuthResponse(authCallbackResults);

//Request that the user sign a transaction by setting the user's browser to this URL
let signUrl = await oreId.getOreIdSignUrl({ account, transaction, signCallbackUrl, chain, state, broadcast });
//...then handle the callback results of the Sign flow
let signResults = oreId.handleSignResponse(signedCallbackResults);

//Get the user's info given a blockchain account
let userInfo = await oreId.getUserInfoFromApi(account);

```

# Express Middlewear

This library includes Express middlewear that you can use to simplify handling the callbacks from the ORE ID service. These functions are asynchronous so we've included a handy handler (asyncHandler) to wrap them.

You can see how to use it in the Express Server example.


# Examples

To run sample code:

Express Server

```
// First populate .env file in root of project directory (copy .env.example to examples/express/.env)

cd examples/express
npm install

node index.js

//to trigger login flow
http://localhost:8888/login/facebook 

```
Note: After callback is handled by handleAuthResponse middlewear, user state is stored on request object (e.g. req.user).

