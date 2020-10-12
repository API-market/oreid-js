const { createProxyMiddleware } = require('http-proxy-middleware')
const express = require('express')
const crypto = require('crypto')
const { isNullOrUndefined } = require('util')

/* eslint-disable no-param-reassign */

/** Generates an HMAC using the full reqest url and returns a HTTP response */
export function generateAndReturnHmac(req, res) {
  const { targetUrl } = req.body
  const hmac = crypto
    .createHmac('sha256', process.env.OREID_API_KEY)
    .update(targetUrl)
    .digest('base64')
  res.set('Content-Type', 'application/json')
  res.send(JSON.stringify({ hmac }))
}

/** Returns middleware that adds Algorand api key to header */
function addAlgorandApiKeysMiddleware(options) {
  // validate options
  if (isNullOrUndefined(options.ALGORAND_API_KEY)) {
    throw new Error(
      'You must provide ALGORAND_API_KEY either in the .env in the root directory of this project or pass it in via the options parameter. See https://github.com/TeamAikon/ore-id-docs',
    )
  }
  return (req, res, next) => {
    req.headers['x-api-key'] = options.ALGORAND_API_KEY
    next()
  }
}

// Appends Oreid api key(s) to header
function addOreidApiKeysMiddleware(options) {
  return (req, res, next) => {
    // inject api-key and service-key(s) to header of request
    if (process.env.OREID_API_KEY) req.headers['api-key'] = options.OREID_API_KEY
    if (process.env.OREID_SERVICE_KEY) req.headers['service-key'] = options.OREID_SERVICE_KEY
    next()
  }
}

/** Returns middleware that adds Configure OREID Proxy */
function oreidProxyMiddleware() {
  return createProxyMiddleware({
    target: process.env.REACT_APP_OREID_URL,
    changeOrigin: true,
    // remove base path in incoming url
    pathRewrite: { '^/oreid': '' },
  })
}

/** Configure Algrand Proxy
    React app path to algorand api is /algorand/testnet/xxx => https://testnet-algorand.api.purestake.io/xxx 
*/
export function algorandProxyMiddleware() {
  return createProxyMiddleware({
    target: 'https://', // not used (replaced by router) but param is required
    changeOrigin: true,
    pathRewrite: {
      // remove base path in incoming url
      '^/algorand/mainnet': '',
      '^/algorand/testnet': '',
      '^/algorand/betanet': '',
    },
    router: {
      // map to endpoint
      '/algorand/mainnet': 'https://mainnet-algorand.api.purestake.io',
      '/algorand/testnet': 'https://testnet-algorand.api.purestake.io',
      '/algorand/betanet': 'https://betanet-algorand.api.purestake.io',
    },
  })
}

/** Adds api routes for /oreid, /oreid/hmac, /algorand, etc.
 *  Also injects apikeys/secrets into request headers
 *  Secrets must be in an .env or provided in oreIdSecrets and/or algorandSecrets parameters
 *  options = { OREID_URL: 'https:oreidservice', OREID_API_KEY: 'myApiKey', OREID_SERVICE_KEY: 'myServerKey', ALGORAND_API_KEY : 'myAlgorandPureStakeApiKey' }
 * */
export function addOreidExpressMiddleware(app, options) {
  // if options not passed-in, construct it from .env values
  if (isNullOrUndefined(options)) {
    options = {
      OREID_URL: process.env.REACT_APP_OREID_URL,
      OREID_API_KEY: process.env.OREID_API_KEY,
      OREID_SERVICE_KEY: process.env.OREID_SERVICE_KEY,
      ALGORAND_API_KEY: process.env.ALGORAND_API_KEY,
    }
  }
  // validate options
  if (
    isNullOrUndefined(options.OREID_URL) ||
    (isNullOrUndefined(options.OREID_API_KEY) && isNullOrUndefined(options.OREID_SERVICE_KEY))
  ) {
    throw new Error(
      'The .env file is missing in the root directory of this project. You need to provide the ORE ID api-key and possibly other secrets there or pass them in via the options parameter. See https://github.com/TeamAikon/ore-id-docs',
    )
  }
  // ------- ORE ID API
  // use the apiKey to generate an hmac for a provided url
  app.use('/oreid/hmac', express.json(), generateAndReturnHmac)
  // proxy all other requests to OREID_URL server
  app.use('/oreid', addOreidApiKeysMiddleware(options), oreidProxyMiddleware())
  // ------ Algorand API
  // proxy /algorand/xxx requests to Algorand API (purestake.io)
  app.use('/algorand', addAlgorandApiKeysMiddleware(options), algorandProxyMiddleware())
}
