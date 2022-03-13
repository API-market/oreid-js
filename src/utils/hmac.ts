import CryptoJS from 'crypto-js'
import Axios from 'axios'
import Helpers from './helpers'

export function generateHmac(secret: string, data: string) {
  const hmac = CryptoJS.HmacSHA256(data, secret)
  return hmac.toString()
}

/** Generate HMAC for data string
 *  data param can be stringified object
 *  If apiKey is not provided, expects useProxyServer:true and a proxy server to be available to generate the hmac
 *  Expects proxyserver /oreid/hmac to host an endpoint to sign with the apiKey and return the hmac
 */
export async function generateHmacWithApiKeyOrProxyServer(useProxyServer: boolean, apiKey: string, data: string) {
  if (!useProxyServer && Helpers.isNullOrEmpty(apiKey)) {
    throw new Error('Cant generate hmac. apiKey missing or empty - its required if not using a proxy server')
  }

  let hmac: string
  if (useProxyServer) {
    try {
      // get an hmac from the proxy server endpoint (since it has the secret apiKey)
      const response = await Axios.post('/oreid/hmac', JSON.stringify({ data }), {
        headers: { 'Content-Type': 'application/json' },
      })
      hmac = response?.data?.hmac
    } catch (networkError) {
      const error = this.getErrorFromAxiosError(networkError)
      throw error
    }
  } else {
    hmac = generateHmac(apiKey, data)
  }
  return hmac
}

/** Generate HMAC for url string and append it to end or url e.g. http:/nnnnnn&hmac=xxx */
export async function appendHmacToUrl(useProxyServer: boolean, apiKey: string, url: string) {
  if (Helpers.isNullOrEmpty(url)) {
    throw new Error('Cant generate hmac. url missing or empty')
  }

  const hmac = await generateHmacWithApiKeyOrProxyServer(useProxyServer, apiKey, url)

  const urlEncodedHmac = encodeURIComponent(hmac)
  // correct hmac already in place
  if (url.includes(`&hmac=${urlEncodedHmac}`)) {
    return url
  }
  return `${url}&hmac=${urlEncodedHmac}`
}
