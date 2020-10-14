import createHmac from 'create-hmac'
import Axios from 'axios'
import Helpers from './helpers'

export function generateHmac(secret: string, data: string) {
  // createHmac library works in browser or Nodejs
  const hmac = createHmac('sha256', secret)
  hmac.update(data)
  const hash = hmac.digest('base64')
  return hash
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
    // get an hmac from the proxy server endpoint (since it has the secret apiKey)
    const response = await Axios.post('/oreid/hmac', JSON.stringify({ data: url }), {
      headers: { 'Content-Type': 'application/json' },
    })
    hmac = response?.data?.hmac
  } else {
    hmac = generateHmac(apiKey, url)
  }

  // correct hmac already in place
  if (url.includes(`&hmac=${hmac}`)) {
    return url
  }
  return `${url}&hmac=${hmac}`
}
