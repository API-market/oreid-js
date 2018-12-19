# oreid-js
ORE ID Helper library written in Javascript

# About

oreid-js is a javascript helper library for interacting with the Aikon ORE ID service.

[ORE ID](https://github.com/api-market/ore-id-docs) is a simple way to add OAuth login to your blockchain enabled app.

# Usage


Example code:
```
//Initialize the library
let oreId = new OreId({ apiKey, oreIdUrl });

//Start the OAuth flow by setting the user's browser to this URL
let authUrl = await oreId.getOreIdAuthUrl({ loginType, callbackUrl, backgroundColor });
//...then handle the callback results of the Auth flow
let authResults = oreId.handleAuthResponse(authCallbackResults);

//Request that the user sign a transaction by setting the user's browser to this URL
let signUrl = await oreId.getOreIdSignUrl({ account, signCallbackUrl, transaction, chain, broadcast });
//...then handle the callback results of the Sign flow
let signResults = oreId.handleSignResponse(signedCallbackResults);

//Get the user's info given a blockchain account
let userInfo = await oreId.getUserInfo(account);

```


# Publish NPM Package

PREREQISITE:

Option 1) Use an .npmrc token
- Include an .npmrc file in the user's root or project root e.g. ~/.npmrc or .../{projectroot}/.npmrc
- To create an .npmrc file, copy the .npmrc.example file and insert the token (retrieved from LastPass)

OR 

Option 2) log-in to npmjs with `npm login` (using account apimarket)

To publish an updated package...

- Update version number in package.json (and example's package.json)
- `npm publish --tag staging` - to publish staging version
- `npm publish` - to publish the production version

package name will be: @aikon/oreid-js@{version}
