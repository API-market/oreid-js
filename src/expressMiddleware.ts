import express, { Express, Request, Response, NextFunction } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import Axios from 'axios'
import { generateHmac } from './hmac'
import { defaultOreIdServiceUrl } from './constants'
import Helpers from './helpers'

const { isNullOrEmpty } = Helpers

export type ExpressMiddlewareOptions = {
  oreidUrl?: string
  apiKey: string
  serviceKey?: string
  algorandApiKey?: string
}

type AsyncHandlerFunc = (req: Request, res: Response, next: NextFunction) => any

/* eslint-disable no-param-reassign */
/** Generic async handler for Express Middleware */
export const asyncHandler = (fn: AsyncHandlerFunc) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

/* eslint-disable no-param-reassign */

/** Returns middleware that generates an HMAC using the full reqest url and returns a HTTP response */
export function addHmacGenerateMiddleware(options: ExpressMiddlewareOptions) {
  return (req: Request, res: Response) => {
    const { data } = req.body
    const hmac = generateHmac(options?.apiKey, data)
    res.set('Content-Type', 'application/json')
    res.send(JSON.stringify({ hmac }))
  }
}

/** Returns middleware that adds Algorand api key to header */
function addAlgorandApiKeysMiddleware(options: ExpressMiddlewareOptions) {
  // validate options
  if (isNullOrEmpty(options?.algorandApiKey)) {
    throw new Error(
      'You must provide algorandApiKey via the options parameter. See https://github.com/TeamAikon/ore-id-docs',
    )
  }
  return (req: Request, res: Response, next: NextFunction) => {
    req.headers['x-api-key'] = options?.algorandApiKey
    next()
  }
}

// Appends Oreid api key(s) to header
function addOreidApiKeysMiddleware(options: ExpressMiddlewareOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    // inject api-key and service-key(s) to header of request
    if (options?.apiKey) req.headers['api-key'] = options.apiKey
    if (options?.serviceKey) req.headers['service-key'] = options.serviceKey
    next()
  }
}

/** Returns middleware that adds Configure OREID Proxy */
function oreidProxyMiddleware(options: ExpressMiddlewareOptions) {
  return createProxyMiddleware({
    target: options?.oreidUrl,
    changeOrigin: true,
    // remove base path in incoming url
    pathRewrite: { '^/oreid': '' },
  })
}

/** Retreive an app-access-token, add it to url, then generate an hmac signature on the url
 *  Needs api-key to header of request
 */
export function addAccessTokenAndHmacToUrl(options: ExpressMiddlewareOptions) {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { oreidUrl, apiKey } = options
    const urlToModify = req.body?.urlString
    if (isNullOrEmpty(urlToModify)) {
      next(new Error('oreid/prepare-url: Missing urlString in JSON body of request'))
    }

    const appTokenApiEndpoint = `${oreidUrl}/api/app-token`
    try {
      // get a new app-access-token
      const response = await Axios.post(appTokenApiEndpoint, null, {
        headers: { 'Content-Type': 'application/json', headers: { 'api-key': apiKey } },
      })
      const { appAccessToken } = response.data
      const urlWithAccessToken = `${urlToModify}&app_access_token=${appAccessToken}`
      // generate hmac on full url
      const hmac = generateHmac(apiKey, urlWithAccessToken)
      res.send({ urlString: `${urlWithAccessToken}&hmac=${hmac}` })
    } catch (e) {
      res.emit('error', new Error(`oreid/prepare-url: Problem in addAccessTokenAndHmacToUrl: ${JSON.stringify(e)}`))
    }
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
export function addOreidExpressMiddleware(app: Express, options: ExpressMiddlewareOptions) {
  // validate options
  if (isNullOrEmpty(options) || (isNullOrEmpty(options?.apiKey) && isNullOrEmpty(options?.serviceKey))) {
    throw new Error(
      'You must provide the ORE ID api-key (or service-key) and possibly other secrets via the options parameter. See https://github.com/TeamAikon/ore-id-docs',
    )
  }

  // default oreid url
  options.oreidUrl = options?.oreidUrl || defaultOreIdServiceUrl

  // ------- ORE ID API
  // use the apiKey to generate an hmac for a provided url
  app.use('/oreid/prepare-url', express.json(), addAccessTokenAndHmacToUrl(options))

  // proxy all other requests to OREID_URL server
  const apiKeysMiddleware = addOreidApiKeysMiddleware(options)
  app.use('/oreid/account/user', apiKeysMiddleware, oreidProxyMiddleware(options))
  app.use('/oreid/services/config', apiKeysMiddleware, oreidProxyMiddleware(options))
  app.use('/oreid/account/add-permission', apiKeysMiddleware, oreidProxyMiddleware(options))
  app.use('/oreid/transaction/can-auto-sign', apiKeysMiddleware, oreidProxyMiddleware(options))
  app.use('/oreid', (_req, _res, next) =>
    next(new Error('This API endpoint cant be called directly within the browser.')),
  )
  // ------ Algorand API
  // proxy /algorand/xxx requests to Algorand API (purestake.io)
  // only enabled if ALGORAND_API_KEY is provided
  if (options?.algorandApiKey) {
    app.use('/algorand', addAlgorandApiKeysMiddleware(options), algorandProxyMiddleware())
  }
}
