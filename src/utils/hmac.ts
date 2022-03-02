import CryptoJS from 'crypto-js'
import Axios from 'axios'
import Helpers from './helpers'

export function generateHmac(secret: string, data: string) {
  const hmac = CryptoJS.HmacSHA256(data, secret)
  return hmac.toString()
}

/** Generate HMAC for url string and append it to end e.g. http:/nnnnnn&hmac=xxx */
export async function appendHmacToUrl(useProxyServer: boolean, apiKey: string, url: string) {
  if (!useProxyServer && Helpers.isNullOrEmpty(apiKey)) {
    throw new Error('Cant generate hmac. apiKey missing or empty - we need it if we arent using a proxy server')
  }
  if (Helpers.isNullOrEmpty(url)) {
    throw new Error('Cant generate hmac. url missing or empty')
  }

  let hmac: string
  if (useProxyServer) {
    try {
      // get an hmac from the proxy server endpoint (since it has the secret apiKey)
      const response = await Axios.post('/oreid/hmac', JSON.stringify({ data: url }), {
        headers: { 'Content-Type': 'application/json' },
      })
      hmac = response?.data?.hmac
    } catch (networkError) {
      const error = this.getErrorFromAxiosError(networkError)
      throw error
    }
  } else {
    hmac = generateHmac(apiKey, url)
  }

  const urlEncodedHmac = encodeURIComponent(hmac)
  // correct hmac already in place
  if (url.includes(`&hmac=${urlEncodedHmac}`)) {
    return url
  }
  return `${url}&hmac=${urlEncodedHmac}`
}
