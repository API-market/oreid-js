import express, { Express, Request, Response, NextFunction } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { isNullOrUndefined } from 'util'
import { generateHmac } from './hmac'
import { defaultOreIdServiceUrl } from './constants'

export type ExpressMiddlewearOptions = {
  oreidUrl?: string
  apiKey: string
  serviceKey?: string
  algorandApiKey?: string
}

/* eslint-disable no-param-reassign */

/** Returns middleware that generates an HMAC using the full reqest url and returns a HTTP response */
export function addHmacGenerateMiddlewear(options: ExpressMiddlewearOptions) {
  return (req: Request, res: Response) => {
    const { data } = req.body
    const hmac = generateHmac(options.apiKey, data)
    res.set('Content-Type', 'application/json')
    res.send(JSON.stringify({ hmac }))
  }
}

/** Returns middleware that adds Algorand api key to header */
function addAlgorandApiKeysMiddleware(options: ExpressMiddlewearOptions) {
  // validate options
  if (isNullOrUndefined(options.algorandApiKey)) {
    throw new Error(
      'You must provide algorandApiKey via the options parameter. See https://github.com/TeamAikon/ore-id-docs',
    )
  }
  return (req: Request, res: Response, next: NextFunction) => {
    req.headers['x-api-key'] = options.algorandApiKey
    next()
  }
}

// Appends Oreid api key(s) to header
function addOreidApiKeysMiddleware(options: ExpressMiddlewearOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    // inject api-key and service-key(s) to header of request
    if (options.apiKey) req.headers['api-key'] = options.apiKey
    if (options.serviceKey) req.headers['service-key'] = options.serviceKey
    next()
  }
}

/** Returns middleware that adds Configure OREID Proxy */
function oreidProxyMiddleware(options: ExpressMiddlewearOptions) {
  return createProxyMiddleware({
    target: options.oreidUrl,
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
 *  Secrets must be provided in options paramters e.g. ...
 *  options = { apiKey: 'myApiKey', serviceKey: 'myServiceKey', algorandApiKey : 'myAlgorandPureStakeApiKey' }
 * */
export function addOreidExpressMiddleware(app: Express, options: ExpressMiddlewearOptions) {
  // validate options
  if (isNullOrUndefined(options) || (isNullOrUndefined(options.apiKey) && isNullOrUndefined(options.serviceKey))) {
    throw new Error(
      'You must provide the ORE ID api-key and possibly other secrets via the options parameter. See https://github.com/TeamAikon/ore-id-docs',
    )
  }

  // default oreid url
  options.oreidUrl = options.oreidUrl || defaultOreIdServiceUrl

  // ------- ORE ID API
  // use the apiKey to generate an hmac for a provided url
  app.use('/oreid/hmac', express.json(), addHmacGenerateMiddlewear(options))
  // proxy all other requests to OREID_URL server
  app.use('/oreid', addOreidApiKeysMiddleware(options), oreidProxyMiddleware(options))
  // ------ Algorand API
  // proxy /algorand/xxx requests to Algorand API (purestake.io)
  // only enabled if ALGORAND_API_KEY is provided
  if (options.algorandApiKey) {
    app.use('/algorand', addAlgorandApiKeysMiddleware(options), algorandProxyMiddleware())
  }
}
